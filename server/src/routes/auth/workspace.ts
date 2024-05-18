import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export const meUserWorkspaceRoute = async (app: FastifyInstance) => {
  app.get(
    "/auth/me/workspaces/:workspaceId",
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
        workspaceId: z.string(),
      });

      try {
        paramsSchema.parse(request.params);
      } catch (error) {
        return reply.status(400).send({
          error: "Invalid request params. Expected { workspaceId: string }",
        });
      }

      const { workspaceId } = paramsSchema.parse(request.params);

      const workspace = await prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
        include: {
          Homework: {
            include: {
              questions: true,
            },
          },
        },
      });

      if (!workspace) {
        return reply.status(404).send({
          error: "Workspace not found",
        });
      }

      return reply.send(workspace);
    }
  );
};
