import { z } from "zod";

const allowedRoles = ["STUDENT", "ADMIN", "INSTRUCTOR"];

export const logInPayload = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof logInPayload>;

export const changePasswordPayload = z.object({
  username: z.string().optional(),
  current_password: z.string(),
  new_password: z.string().min(8).max(128),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordPayload>;

export const createUserPayload = z.object({
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

export type CreateUserSchema = z.infer<typeof createUserPayload>;
