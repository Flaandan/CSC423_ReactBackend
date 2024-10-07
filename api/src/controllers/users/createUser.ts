import { Context } from "hono";
import { computePasswordHash } from "../../services/authService.js";
import { insertUser } from "../../services/userService.js";
import { createUserPayload } from "../../utils/types.js";

// Propagates errors to responseMapper
async function createUser(ctx: Context): Promise<Response> {
  const payload = await ctx.req.json();

  const parsedPayload = createUserPayload.parse(payload);

  const passwordHash = await computePasswordHash(parsedPayload.password);

  await insertUser(parsedPayload, passwordHash);

  return ctx.json({ success: "user created" }, 201);
}

export { createUser };
