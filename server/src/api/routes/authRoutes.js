import { changePassword, login } from "../handlers/authHandler.js";

function authRoutes(server) {
  server.post("/v1/auth/login", async (ctx) => await login(ctx));

  server.post(
    "/v1/auth/change-password",
    async (ctx) => await changePassword(ctx),
  );
}

export { authRoutes };
