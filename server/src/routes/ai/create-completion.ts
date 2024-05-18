import { OpenAIStream } from "ai";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { openai, streamRes } from "./../../lib/opeanai";

export const createCompletionRoute = async (app: FastifyInstance) => {
  app.post("/ai/completion", async (request, reply) => {
    const bodySchema = z.object({
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    const { prompt, temperature } = bodySchema.parse(request.body);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);

    return streamRes(stream, reply);
  });
};
