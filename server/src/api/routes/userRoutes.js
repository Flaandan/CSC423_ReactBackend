import { createUser } from "../handlers/userHandler.js";

function userRoutes(server) {
  server.post("/v1/users", async (ctx) => await createUser(ctx));
}

export { userRoutes };
