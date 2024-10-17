import { healthCheck } from "../handlers/healthHandler.js";

function healthRoutes(server) {
  server.get("/v1/health", async (ctx) => await healthCheck(ctx));
}

export { healthRoutes };
