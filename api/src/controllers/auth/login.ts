import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { validateCredentials } from "../../services/authService.js";
import { COOKIE_KEY, generateToken } from "../../services/jwtService.js";
import { logInPayload } from "../../utils/types.js";

// Propagates errors to responseMapper
async function login(ctx: Context): Promise<Response> {
  const payload = await ctx.req.json();

  const parsedPayload = logInPayload.parse(payload);

  const user = await validateCredentials(parsedPayload);

  const token = await generateToken(user);

  setCookie(ctx, COOKIE_KEY, token, {
    path: "/",
    secure: false,
    httpOnly: true,
    maxAge: 3600, // 1 hour
    sameSite: "Strict",
  });

  return ctx.json({ user: user }, 200);
}

export { login };
