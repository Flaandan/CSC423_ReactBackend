import { validateCredentialsService } from "../services/authService.js";
import {
  changeUserPasswordService,
  getUserByIdService,
} from "../services/userService.js";
import { generateAccessToken } from "../utils/jwt/generate.js";
import {
  changePasswordPayload,
  logInPayload,
} from "../utils/validationSchemas.js";

export async function apiLogin(ctx) {
  const payload = await ctx.req.json();
  const parsedPayload = logInPayload.parse(payload);

  const userDetails = await validateCredentialsService(parsedPayload);

  const userDTO = await getUserByIdService(userDetails.id);

  const token = await generateAccessToken(userDTO);

  return ctx.json({ user: userDTO, access_token: token }, 200);
}

export async function apiChangePassword(ctx) {
  const payload = await ctx.req.json();
  const jwtPayload = ctx.get("jwtPayload");
  const parsedPayload = changePasswordPayload.parse(payload);

  const userDetails = {
    id: jwtPayload.user_id,
    username: jwtPayload.sub,
    ...parsedPayload,
  };

  await changeUserPasswordService(userDetails);

  return ctx.json({ success: "password changed" }, 200);
}

// This handler is behind a middleware checking the validity of JWT token provided
export async function apiCheckToken(ctx) {
  return ctx.text("", 200);
}
