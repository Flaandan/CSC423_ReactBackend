import { Hono } from "hono";
import { healthCheck } from "./controllers/healthCheck.js";

function setupRoutes(server: Hono) {
  server.get("/health", (ctx) => healthCheck(ctx));
}

export { setupRoutes };
