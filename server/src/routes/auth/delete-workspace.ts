import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export const meUserDeleteWorkspaceRoute = async (app: FastifyInstance) => {
  app.delete(
    "/auth/me/workspaces",
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
        id: z.string(),
      });

      try {
        bodySchema.parse(request.body);
      } catch (error) {
        return reply.status(400).send({
          error:
            "Invalid request body. Expected { name: string, description: string, image: string }",
        });
      }

      const { id } = bodySchema.parse(request.body);

      const workspace = await prisma.workspace.delete({
        where: {
          id,
        },
      });

      return reply.send(workspace);
    }
  );
};
