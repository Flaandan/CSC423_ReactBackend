import { Hono } from "hono";
import { healthCheck } from "./controllers/health.js";
import { login } from "./controllers/login.js";

function setupRoutes(server: Hono) {
  server.get("/health", async (ctx) => await healthCheck(ctx));

  server.post("/auth/login", async (ctx) => await login(ctx));
}

export { setupRoutes };
