import { apiHealthCheck } from "../controllers/healthController.js";

export function healthRoutes(server) {
  server.on("GET", "/api/v1/health", async (ctx) => await apiHealthCheck(ctx));
}
