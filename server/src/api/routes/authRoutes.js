import {
  apiChangePassword,
  apiCheckToken,
  apiLogin,
} from "../controllers/authController.js";
import { jwtFilter } from "../middleware/jwtAuthFilter.js";
import { roleFilter } from "../middleware/roleCheckFilter.js";

export function authRoutes(server) {
  server.on("POST", "/api/v1/auth/login", async (ctx) => await apiLogin(ctx));

  server.on(
    "POST",
    "/api/v1/auth/change-password",
    jwtFilter(),
    async (ctx) => await apiChangePassword(ctx),
  );

  server.on(
    "GET",
    "/api/v1/auth/check",
    jwtFilter(),
    async (ctx) => await apiCheckToken(ctx),
  );
}
