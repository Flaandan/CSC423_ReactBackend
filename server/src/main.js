import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { jwtFilter } from "./api/middleware/jwtAuthFilter.js";
import { responseMapper } from "./api/middleware/responseMapper.js";
import { roleFilter } from "./api/middleware/roleCheckFilter.js";
import { authRoutes } from "./api/routes/authRoutes.js";
import { courseRoutes } from "./api/routes/courseRoutes.js";
import { healthRoutes } from "./api/routes/healthRoutes.js";
import { majorRoutes } from "./api/routes/majorRoutes.js";
import { userRoutes } from "./api/routes/userRoutes.js";
import { config } from "./config.js";

function main() {
  const port = config.serverPort;
  const host = config.serverHost;

  const server = new Hono();

  // ALL MIDDLEWARE MUST BE DECLARED BEFORE DECLARING ROUTES OR
  // ELSE THEY WILL NOT BE APPLIED TO THE ROUTES

  // -- MIDDLEWARE start
  // Modify responses errors before they are sent to the client
  responseMapper(server);

  // Compress response body
  server.use(compress());

  // Simple logger provided by Hono
  server.use(logger());

  // CORS configuration for all endpoints
  server.use(
    "*",
    cors({
      origin: "http://localhost:5173",
      allowHeaders: ["Accept", "Authorization", "Content-Type"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 600,
    }),
  );
  // -- MIDDLEWARE end

  // Routes for server
  healthRoutes(server);
  authRoutes(server);
  userRoutes(server);
  majorRoutes(server);
  courseRoutes(server);

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

main();
