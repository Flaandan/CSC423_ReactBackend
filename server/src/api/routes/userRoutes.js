import {
  apiCreateUser,
  apiDeleteUser,
  apiGetAllUsers,
  apiGetUserByUsername,
  apiUpdateUser,
} from "../controllers/userController.js";

export function userRoutes(server) {
  server.on("GET", "/api/v1/users", async (ctx) => await apiGetAllUsers(ctx));

  server.on("POST", "/api/v1/users", async (ctx) => await apiCreateUser(ctx));

  server.on(
    "GET",
    "/api/v1/users/:username",
    async (ctx) => await apiGetUserByUsername(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/users/:username",
    async (ctx) => await apiUpdateUser(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/users/:username",
    async (ctx) => await apiDeleteUser(ctx),
  );
}
