import { z } from "zod";
import { validateCredentials } from "../services/authService.js";
import { generateToken } from "../services/jwtService.js";
import { changeUserPassword } from "../services/userService.js";

const logInPayload = z.object({
  username: z.string(),
  password: z.string(),
});

const changePasswordPayload = z.object({
  current_password: z.string(),
  new_password: z.string().min(8).max(128),
});

async function login(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = logInPayload.parse(payload);

  const userDTO = await validateCredentials(parsedPayload);

  const token = await generateToken(userDTO);

  return ctx.json({ user: userDTO, access_token: token }, 200);
}

async function changePassword(ctx) {
  const payload = await ctx.req.json();
  const jwtPayload = ctx.get("jwtPayload");

  const parsedPayload = changePasswordPayload.parse(payload);

  const userDetails = {
    username: jwtPayload.sub,
    ...parsedPayload,
  };

  await changeUserPassword(userDetails);

  return ctx.json({ success: "password changed" }, 200);
}

async function checkToken(ctx) {
  const jwtPayload = ctx.get("jwtPayload");

  const tokenDetails = {
    ...jwtPayload,
  };

  return ctx.json(tokenDetails, 200);
}

export { login, changePassword, checkToken };
