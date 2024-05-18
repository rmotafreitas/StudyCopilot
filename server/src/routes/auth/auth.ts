import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import * as jose from "jose";

export const authUserRoute = async (app: FastifyInstance) => {
  app.post("/auth/me", async (request, reply) => {
    const bodySchema = z.object({
      auth: z.string(),
      login: z.string(),
    });

    try {
      bodySchema.parse(request.body);
    } catch (error) {
      return reply.status(400).send({
        error: "Invalid request body. Expected { auth: string, email: string }",
      });
    }

    const { auth, login } = bodySchema.parse(request.body);

    try {
      jose.decodeJwt(auth ?? "");
    } catch (error) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const payload = jose.decodeJwt(auth ?? "");
    const userID = payload.sub;

    if (!userID || auth === undefined) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
    });

    if (!user) {
      const lookUpEmail = await prisma.user.findUnique({
        where: {
          email: login,
        },
      });

      if (lookUpEmail) {
        return reply.status(400).send({
          error: "Unauthorized",
        });
      }

      const resNewUser = await prisma.user.create({
        data: {
          id: userID,
          email: login,
        },
      });

      const payload_jwt = {
        id: resNewUser.id,
        email: resNewUser.email,
      };

      const token = request.jwt.sign(payload_jwt);

      reply.setCookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
      });

      return reply.send({ ...resNewUser, accessToken: token });
    }

    if (user.id !== userID || user.email !== login) {
      return reply.status(400).send({ error: "Unauthorized" });
    }

    const payload_jwt = {
      id: user.id,
      email: user.email,
    };

    const token = request.jwt.sign(payload_jwt);

    reply.setCookie("access_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
    });

    return reply.send({ ...user, accessToken: token });
  });
};
