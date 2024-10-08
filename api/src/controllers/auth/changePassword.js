import { changeUserPassword } from "../../services/userService.js";
import { changePasswordPayload } from "../../utils/requestPayloads.js";

async function changePassword(ctx) {
  const payload = await ctx.req.json();
  const jwtPayload = await ctx.get("jwtPayload");

  const parsedPayload = changePasswordPayload.parse(payload);

  const userDetails = {
    username: jwtPayload["sub"],
    ...parsedPayload,
  };

  await changeUserPassword(userDetails);

  return ctx.json({ success: "password changed" }, 200);
}

export { changePassword };
