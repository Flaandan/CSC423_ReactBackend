import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { config as Config } from "./config.js";
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

  static build(config: typeof Config) {
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

  setupRoutes(server);

  return server;
}

export { Application };
