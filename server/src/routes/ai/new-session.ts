import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export const meUserHomeworkSessionRoute = async (app: FastifyInstance) => {
  app.post(
    "/auth/me/homeworks",
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

      const bodySchema = z.object({
        workspaceId: z.string(),
      });

      try {
        bodySchema.parse(request.body);
      } catch (error) {
        return reply.status(400).send({
          error: "The workspaceId is required to be in the request body",
        });
      }

      const { workspaceId } = bodySchema.parse(request.body);

      const workspace = await prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      });

      if (!workspace) {
        return reply.status(404).send({
          error: "Workspace not found",
        });
      }

      const homework = await prisma.homework.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          workspace: {
            connect: {
              id: workspace.id,
            },
          },
        },
      });

      return reply.send(homework);
    }
  );
};
