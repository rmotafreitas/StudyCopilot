import { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { openai } from "../../lib/opeanai";

export const createCompletionWithScreenshotRoute = async (
  app: FastifyInstance
) => {
  app.post(
    "/ai/completion-screenshot",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const bodySchema = z.object({
        prompt: z.string(),
        temperature: z.number().min(0).max(1).default(0.5),
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

      const { prompt, temperature, filename } = bodySchema.parse(request.body);

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

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64}`,
                },
              },
            ],
          },
        ],
        stream: false,
        max_tokens: 300,
      });

      return response.choices[0].message.content;
    }
  );
};
