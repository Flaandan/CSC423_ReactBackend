import { changePassword, checkToken, login } from "../handlers/authHandler.js";

function authRoutes(server) {
  server.get("/v1/auth/check", async (ctx) => await checkToken(ctx));
  server.post("/v1/auth/login", async (ctx) => await login(ctx));
  server.post(
    "/v1/auth/change-password",
    async (ctx) => await changePassword(ctx),
  );
}

export { authRoutes };
