import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { setupEndpoints } from "./endpoints.js";
import { jwtCheck } from "./middleware/jwtMiddleware.js";
import { responseMapper } from "./middleware/responseMapper.js";
import { roleCheck } from "./middleware/roleCheckMiddleware.js";

class Application {
  #port;

  #host;

  #server;

  constructor(port, host, server) {
    this.#port = port;
    this.#host = host;
    this.#server = server;
  }

  static build(config) {
    const port = config.serverPort;
    const host = config.serverHost;

    const server = setup();

    return new Application(port, host, server);
  }

  get port() {
    return this.#port;
  }

  get host() {
    return this.#host;
  }

  runServer() {
    return serve({
      fetch: this.#server.fetch,
      port: this.port,
      hostname: this.host,
    });
  }
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
  server.use("/users/*", roleCheck(["ADMIN"]));

  // Restricts endpoint to only authorized users (anyone with valid token)
  server.use("/auth/change-password", jwtCheck());

  // Endpoints for server
  setupEndpoints(server);

  return server;
}

export { Application };
