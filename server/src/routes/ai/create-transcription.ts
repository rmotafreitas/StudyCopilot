import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { openai } from "../../lib/opeanai";
import fs from "node:fs";

export const createTranscriptionRoute = async (app: FastifyInstance) => {
  app.post("/ai/transcription", async (request, reply) => {
    const paramsSchema = z.object({
      filename: z.string(),
    });

    let filename: string;

    try {
      filename = paramsSchema.parse(request.body).filename;
    } catch (error) {
      return reply
        .status(400)
        .send({ error: "The file name is required to be in the request body" });
    }

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

    const audioReadStream = createReadStream(uploadDir);

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "en",
      response_format: "json",
      temperature: 0,
      prompt: "Transcribe the following audio",
    });

    const transcript = response.text;

    return { transcript };
  });
};
