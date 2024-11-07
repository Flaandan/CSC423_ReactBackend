import {
  apiChangePassword,
  apiCheckToken,
  apiLogin,
} from "../controllers/authController.js";

export function authRoutes(server) {
  server.on("POST", "/api/v1/auth/login", async (ctx) => await apiLogin(ctx));

  server.on(
    "GET",
    "/api/v1/auth/check",
    async (ctx) => await apiCheckToken(ctx),
  );

  server.on(
    "POST",
    "/api/v1/auth/change-password",
    async (ctx) => await apiChangePassword(ctx),
  );
}
