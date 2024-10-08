import { computePasswordHash } from "../../services/authService.js";
import { insertUser } from "../../services/userService.js";
import { createUserPayload } from "../../utils/requestPayloads.js";

async function createUser(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = createUserPayload.parse(payload);

  const passwordHash = await computePasswordHash(parsedPayload.password);

  await insertUser(parsedPayload, passwordHash);

  return ctx.json({ success: "user created" }, 201);
}

export { createUser };
