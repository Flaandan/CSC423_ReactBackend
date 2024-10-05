import { Hono } from "hono";
import { login } from "./controllers/auth/login.js";
import { healthCheck } from "./controllers/health.js";
import { createUser } from "./controllers/users/createUser.js";

function setupRoutes(server: Hono) {
  server.get("/health", async (ctx) => await healthCheck(ctx));

  server.post("/auth/login", async (ctx) => await login(ctx));

  server.post("/users", async (ctx) => await createUser(ctx));
}

export { setupRoutes };
