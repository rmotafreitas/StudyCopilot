import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export const meUserUpdateWorkspaceRoute = async (app: FastifyInstance) => {
  app.put(
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
        name: z.string(),
        description: z.string(),
        image: z.string(),
      });

      try {
        bodySchema.parse(request.body);
      } catch (error) {
        return reply.status(400).send({
          error:
            "Invalid request body. Expected { name: string, description: string, image: string }",
        });
      }

      const { name, description, image, id } = bodySchema.parse(request.body);

      const workspace = await prisma.workspace.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          image,
        },
      });

      return reply.send(workspace);
    }
  );
};
