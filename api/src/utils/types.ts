import { z } from "zod";

const allowedRoles = ["STUDENT", "ADMIN", "INSTRUCTOR"];

const logInPayload = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginSchema = z.infer<typeof logInPayload>;

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

type CreateUserSchema = z.infer<typeof createUserPayload>;

export { logInPayload, LoginSchema, createUserPayload, CreateUserSchema };
