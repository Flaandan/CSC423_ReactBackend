import { z } from "zod";
import { changeUserPassword } from "../../services/userService.js";

const changePasswordPayload = z.object({
  username: z.string().optional(),
  current_password: z.string(),
  new_password: z.string().min(8).max(128),
});

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
