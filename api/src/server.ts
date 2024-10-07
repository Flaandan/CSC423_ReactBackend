import { serve, ServerType } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { JwtVariables } from "hono/jwt";
import { logger } from "hono/logger";
import { config as Config } from "./config.js";
import { setupEndpoints } from "./endpoints.js";
import { responseMapper } from "./middleware/responseMapper.js";
import { roleCheck } from "./middleware/roleCheckMiddleware.js";
import { jwtCheck } from "./middleware/jwtMiddleware.js";

type HonoServer = Hono<{ Variables: JwtVariables }>;

class Application {
  #port;

  #host;

  #server;

  constructor(port: number, host: string, server: HonoServer) {
    this.#port = port;
    this.#host = host;
    this.#server = server;
  }

  static build(config: typeof Config): Application {
    const port = config.serverPort;
    const host = config.serverHost;

    const server = setup();

    return new Application(port, host, server);
  }

  get port(): number {
    return this.#port;
  }

  get host(): string {
    return this.#host;
  }

  runServer(): ServerType {
    return serve({
      fetch: this.#server.fetch,
      port: this.port,
      hostname: this.host,
    });
  }
}

function setup(): HonoServer {
  const server = new Hono<{ Variables: JwtVariables }>();

  // MIDDLEWARE //
  responseMapper(server);

  // Compress response body
  server.use(compress());

  // Simple logger provided by Hono
  server.use(logger());

  // Restricts all users endpoints to only ADMIN users
  server.use("/users/*", roleCheck(["ADMIN"]));

  server.use("/auth/change-password", jwtCheck());

  // ENDPOINTS //
  setupEndpoints(server);

  return server;
}

export { Application, HonoServer };
