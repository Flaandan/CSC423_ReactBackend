import { Context } from "hono";
import { z } from "zod";
import { validateCredentials } from "../../services/authService.js";

const requestPayload = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginSchema = z.infer<typeof requestPayload>;

// Propagates errors to the responseMapperMiddleware
async function login(ctx: Context): Promise<Response> {
  const body = await ctx.req.json();

  const parsedBody = requestPayload.parse(body);

  await validateCredentials(parsedBody);

  return ctx.json({ success: "login successful" }, 200);
}

export { login, LoginSchema };
