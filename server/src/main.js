import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { jwtFilter } from "./api/middleware/jwtAuthFilter.js";
import { responseMapper } from "./api/middleware/responseMapper.js";
import { roleFilter } from "./api/middleware/roleCheckFilter.js";
import { authRoutes } from "./api/routes/authRoutes.js";
import { healthRoutes } from "./api/routes/healthRoutes.js";
import { userRoutes } from "./api/routes/userRoutes.js";
import { config } from "./config.js";

function main() {
  const port = config.serverPort;
  const host = config.serverHost;

  const server = setup();

  console.table([
    {
      Listening: `${host}:${port}`,
      Environment: process.env.NODE_ENV,
    },
  ]);

  serve({
    fetch: server.fetch,
    port: port,
    hostname: host,
  });
}

function setup() {
  const server = new Hono();

  // Modify responses before they are sent to the client
  responseMapper(server);

  // Compress response body
  server.use(compress());

  // Simple logger provided by Hono
  server.use(logger());

  // CORS
  server.use(
    "*",
    cors({
      origin: "http://localhost:5173",
      allowHeaders: ["Accept", "Authorization", "Content-Type"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 600,
    }),
  );

  // Restricts all users endpoints to only ADMIN users
  server.use("/v1/users/*", roleFilter(["ADMIN"]));

  // Restricts endpoint to only authorized users (anyone with valid token)
  server.use("/v1/auth/change-password", jwtFilter());

  // Routes for server
  healthRoutes(server);
  authRoutes(server);
  userRoutes(server);

  return server;
}

main();
