import { Context } from "hono";
import { z } from "zod";
import { computePasswordHash } from "../../services/authService.js";
import { insertUser } from "../../services/userService.js";

const allowedRoles = ["STUDENT", "ADMIN", "INSTRUCTOR"];

const requestPayload = z.object({
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

type CreateUserSchema = z.infer<typeof requestPayload>;

// Propagates errors to the responseMapperMiddleware
async function createUser(ctx: Context): Promise<Response> {
  const body = await ctx.req.json();

  const parsedBody = requestPayload.parse(body);

  const passwordHash = await computePasswordHash(parsedBody.password);

  await insertUser(parsedBody, passwordHash);

  return ctx.json({ success: "user created" }, 201);
}

export { createUser, CreateUserSchema };
