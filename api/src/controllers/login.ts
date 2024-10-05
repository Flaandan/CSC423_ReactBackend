import { Context } from "hono";
import { z } from "zod";
import { validateCredentials } from "../services/authService.js";

const logInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LogInSchema = z.infer<typeof logInSchema>;

// Propagates errors to the responseMapper middleware
async function login(ctx: Context): Promise<Response> {
  const body = await ctx.req.json();

  const parsedRequest = logInSchema.parse(body);

  await validateCredentials(parsedRequest);

  return ctx.json({ success: "login successful" }, 200);
}

export { login, LogInSchema };
