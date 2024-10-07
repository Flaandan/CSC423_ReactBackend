import { changePassword } from "./controllers/auth/changePassword.js";
import { login } from "./controllers/auth/login.js";
import { healthCheck } from "./controllers/health.js";
import { createUser } from "./controllers/users/createUser.js";
import { HonoServer } from "./server.js";

function setupEndpoints(server: HonoServer) {
  server.get("/health", async (ctx) => await healthCheck(ctx));

  server.post("/auth/login", async (ctx) => await login(ctx));

  server.post(
    "/auth/change-password",
    async (ctx) => await changePassword(ctx),
  );

  server.post("/users", async (ctx) => await createUser(ctx));
}

export { setupEndpoints };
