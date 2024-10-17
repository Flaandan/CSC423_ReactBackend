import { z } from "zod";
import { User } from "../../models/user.js";
import { computePasswordHash } from "../services/authService.js";
import { insertUser } from "../services/userService.js";

const allowedRoles = ["STUDENT", "ADMIN", "INSTRUCTOR"];

const createUserPayload = z.object({
  username: z.string().min(3).max(255),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
  password: z.string().min(8).max(128),
  role: z.string().refine((value) => {
    return allowedRoles.includes(value);
  }),
  phone_number: z.string().min(10).max(14),
  office: z.string().min(1).max(255).optional(),
});

async function createUser(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = createUserPayload.parse(payload);

  const passwordHash = await computePasswordHash(parsedPayload.password);

  const user = new User.builder()
    .setUsername(parsedPayload.username)
    .setFirstName(parsedPayload.first_name)
    .setLastName(parsedPayload.last_name)
    .setPasswordHash(passwordHash)
    .setRole(parsedPayload.role)
    .setPhoneNumber(parsedPayload.phone_number)
    .setOffice(parsedPayload.office)
    .build();

  await insertUser(user);

  return ctx.json({ success: "user created" }, 201);
}

export { createUser };
