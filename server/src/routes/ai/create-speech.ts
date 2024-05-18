import { FastifyInstance } from "fastify";
import { z } from "zod";
import { openai } from "./../../lib/opeanai";

export const createSpeechRoute = async (app: FastifyInstance) => {
  app.post("/ai/speech", async (request, reply) => {
    const bodySchema = z.object({
      text: z.string(),
    });

    // check if the request body is valid
    try {
      bodySchema.parse(request.body);
    } catch (error) {
      reply.status(400).send({ error: "Invalid request body" });
      return;
    }

    const { text } = bodySchema.parse(request.body);

    if (!text) {
      reply.status(400).send({ error: "Text is required" });
      return;
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    reply.header("Content-Type", "audio/mpeg").send(buffer);
  });
};
