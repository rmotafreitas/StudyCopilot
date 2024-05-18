import { prisma } from "./../../lib/prisma";
import { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { openai } from "../../lib/opeanai";

export const askQuestionRoute = async (app: FastifyInstance) => {
  app.post(
    "/ai/ask-question",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const bodySchema = z.object({
        prompt: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
        homeworkId: z.string(),
        filename: z.string(),
      });

      try {
        bodySchema.parse(request.body);
      } catch (error) {
        return reply.status(400).send({
          error:
            "Invalid request body. Expected { prompt: string, temperature: number, screenshotFilename: string }  ",
        });
      }

      const { prompt, temperature, homeworkId, filename } = bodySchema.parse(
        request.body
      );

      const homework = await prisma.homework.findUnique({
        where: { id: homeworkId },
        include: { questions: true },
      });

      if (!homework) {
        return reply.status(404).send({ error: "Homework not found" });
      }

      const messages: any[] = [];

      for (const question of homework.questions) {
        if (!question?.screenshot) continue;
        if (!question?.answer) continue;

        const uploadDir = path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "uploads",
          question.screenshot
        );

        try {
          await fs.promises.access(uploadDir);
        } catch (error) {
          return reply.status(404).send({ error: "File not found" });
        }

        const base64 = fs.readFileSync
          ? fs.readFileSync(uploadDir, "base64")
          : fs.readFileSync(uploadDir).toString("base64");

        // Add the question prompt and screenshot to the messages array
        messages.push({
          role: "user",
          content: [
            { type: "text", text: question.prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64}`,
              },
            },
          ],
        });

        // Add the answer to the messages array
        messages.push({
          role: "system",
          content: [{ type: "text", text: question.answer }],
        });
      }

      // Add the user's prompt to the messages array
      const uploadDir = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        filename
      );

      try {
        await fs.promises.access(uploadDir);
      } catch (error) {
        return reply.status(404).send({ error: "File not found" });
      }

      const base64 = fs.readFileSync
        ? fs.readFileSync(uploadDir, "base64")
        : fs.readFileSync(uploadDir).toString("base64");

      const tokens = 800;
      const chars = tokens * 4;

      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `${prompt} '''Answer in less than ${chars} characters and rember that your output is in voice so dont use math symbols or latex syntax, just a clear string answer'''`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${base64}`,
            },
          },
        ],
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature,
        messages,
        stream: false,
        max_tokens: tokens * 2,
      });

      const newQuestion = await prisma.quesionFromHomework.create({
        data: {
          Homework: { connect: { id: homeworkId } },
          prompt,
          answer: response.choices[0].message.content,
          screenshot: filename,
        },
      });

      return newQuestion;
    }
  );
};
