import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export const updateUserRoute = async (app: FastifyInstance) => {
  app.put(
    "/auth/me",
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
        name: z.string(),
      });

      try {
        bodySchema.parse(request.body);
      } catch (error) {
        return reply.status(400).send({
          error: "Invalid request body. Expected { name: string }",
        });
      }

      const { name } = bodySchema.parse(request.body);

      const updatedUser = await prisma.user.update({
        where: {
          id: request.user.id,
        },
        data: {
          name,
        },
      });

      return reply.send(updatedUser);
    }
  );
};
