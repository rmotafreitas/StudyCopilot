import { meUserRoute } from "./routes/auth/me";
import { authUserRoute } from "./routes/auth/auth";
import { fastifyCors } from "@fastify/cors";
import fastifystatic from "@fastify/static";
import "dotenv/config";
import { fastify, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { createTranscriptionRoute } from "./routes/ai/create-transcription";
import { uploadAudioRoute } from "./routes/upload/upload-audio";
import { createCompletionRoute } from "./routes/ai/create-completion";
import { createSpeechRoute } from "./routes/ai/create-speech";
import { uploadScreenshotRoute } from "./routes/upload/upload-screenshot";
import { createCompletionWithScreenshotRoute } from "./routes/ai/create-completion-with-screenshot";

const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

// ===== JWT AUTHENTICATION =====

import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { updateUserRoute } from "./routes/auth/update";
import { logoutUserRoute } from "./routes/auth/logout";
import { meUserWorkspaceRoute } from "./routes/auth/workspace";
import { askQuestionRoute } from "./routes/ai/ask-question";
import { meUserHomeworkRoute } from "./routes/auth/homework";
import { meUserHomeworkSessionRoute } from "./routes/ai/new-session";
import { meUserCreateWorkspaceRoute } from "./routes/auth/create-workspace";
import { meUserUpdateWorkspaceRoute } from "./routes/auth/update-workspace";
import { meUserDeleteWorkspaceRoute } from "./routes/auth/delete-workspace";
import { meUserDeleteHomeworkRoute } from "./routes/auth/delete-homework";

// jwt
app.register(fjwt, { secret: process.env.JWT_SECRET || "supersecret" });

app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token =
      req.cookies.access_token || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }
    // here decoded will be a different type by default but we want it to be of user-payload type
    const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
    req.user = decoded;
  }
);

app.addHook("preHandler", (req, res, next) => {
  // here we are
  req.jwt = app.jwt;
  return next();
});

// cookies
app.register(fCookie, {
  secret: process.env.JWT_SECRET_COOKIE,
  hook: "preHandler",
});

// ===== JWT AUTHENTICATION END =====

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.register(uploadAudioRoute);
app.register(createTranscriptionRoute);
app.register(createCompletionRoute);
app.register(createSpeechRoute);
app.register(uploadScreenshotRoute);
app.register(createCompletionWithScreenshotRoute);
app.register(authUserRoute);
app.register(meUserRoute);
app.register(updateUserRoute);
app.register(logoutUserRoute);
app.register(meUserWorkspaceRoute);
app.register(askQuestionRoute);
app.register(meUserHomeworkRoute);
app.register(meUserHomeworkSessionRoute);
app.register(meUserCreateWorkspaceRoute);
app.register(meUserUpdateWorkspaceRoute);
app.register(meUserDeleteWorkspaceRoute);
app.register(meUserDeleteHomeworkRoute);

app.register(fastifystatic, {
  root: path.join(__dirname, "..", "uploads"),
  prefix: "/uploads/",
});

app
  .listen({
    host,
    port: Number(process.env.PORT) || 3000,
  })
  .then((address) => {
    console.log(`Server listening on ${address}`);
  });
