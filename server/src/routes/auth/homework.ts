import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export const meUserHomeworkRoute = async (app: FastifyInstance) => {
  app.get(
    "/auth/me/homeworks/:homeworkId",
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: {
          id: request.user.id,
        },
      });

      if (!user) {
        return reply.status(404).send({
          error: "User not found",
        });
      }

      const paramsSchema = z.object({
        homeworkId: z.string(),
      });

      try {
        paramsSchema.parse(request.params);
      } catch (error) {
        return reply.status(400).send({
          error: "Invalid request params. Expected { homeworkId: string }",
        });
      }

      const { homeworkId } = paramsSchema.parse(request.params);

      const homework = await prisma.homework.findUnique({
        where: {
          id: homeworkId,
        },
        include: {
          questions: true,
          user: true,
        },
      });

      if (!homework) {
        return reply.status(404).send({
          error: "Homework not found",
        });
      }

      return reply.send(homework);
    }
  );
};
