import { Context } from "hono";
import { changeUserPassword } from "../../services/userService.js";
import {
  changePasswordPayload,
  ChangePasswordSchema,
} from "../../utils/types.js";

// Propagates errors to responseMapper
async function changePassword(ctx: Context): Promise<Response> {
  const payload = await ctx.req.json();
  const jwtPayload = await ctx.get("jwtPayload");

  const parsedPayload = changePasswordPayload.parse(payload);

  const userDetails: ChangePasswordSchema = {
    username: jwtPayload["sub"],
    ...parsedPayload,
  };

  await changeUserPassword(userDetails);

  return ctx.json({ success: "password changed" }, 200);
}

export { changePassword };
