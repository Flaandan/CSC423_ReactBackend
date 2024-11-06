import { validateCredentials } from "../services/authService.js";
import { generateToken } from "../services/jwtService.js";
import {
  changeUserPassword,
  fetchUserByUsername,
} from "../services/userService.js";
import { changePasswordPayload, logInPayload } from "../utils/schemas.js";

export async function apiLogin(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = logInPayload.parse(payload);

  const username = await validateCredentials(parsedPayload);

  const userDTO = await fetchUserByUsername(username);

  const token = await generateToken(userDTO);

  return ctx.json({ user: userDTO, access_token: token }, 200);
}

export async function apiChangePassword(ctx) {
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

export async function apiCheckToken(ctx) {
  const jwtPayload = ctx.get("jwtPayload");

  const tokenDetails = {
    ...jwtPayload,
  };

  return ctx.json(tokenDetails, 200);
}
