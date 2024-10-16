import { z } from "zod";
import { validateCredentials } from "../../services/authService.js";
import { generateAccessToken } from "../../services/jwtService.js";

const logInPayload = z.object({
  username: z.string(),
  password: z.string(),
});

async function login(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = logInPayload.parse(payload);

  const userDTO = await validateCredentials(parsedPayload);

  const token = await generateAccessToken(userDTO);

  return ctx.json({ user: userDTO, access_token: token }, 200);
}

export { login };
