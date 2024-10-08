import { setCookie } from "hono/cookie";
import { validateCredentials } from "../../services/authService.js";
import { COOKIE_KEY, generateToken } from "../../services/jwtService.js";
import { logInPayload } from "../../utils/requestPayloads.js";

// TODO: Change cookies. Tokens will be stored in local storage

async function login(ctx) {
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
