import { serve, ServerType } from "@hono/node-server";
import { Hono } from "hono";
import { config as Config } from "./config.js";
import { responseMapperMiddleware } from "./middleware/responseMapper.js";
import { setupRoutes } from "./routes.js";

class Application {
  #port;

  #host;

  #server;

  constructor(port: number, host: string, server: Hono) {
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

function setup(): Hono {
  const server = new Hono();

  setupRoutes(server);

  responseMapperMiddleware(server);

  return server;
}

export { Application };
