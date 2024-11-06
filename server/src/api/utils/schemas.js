import { z } from "zod";

const allowedRoles = ["STUDENT", "ADMIN", "INSTRUCTOR"];

export const logInPayload = z.object({
  username: z.string(),
  password: z.string(),
});

export const changePasswordPayload = z.object({
  current_password: z.string(),
  new_password: z.string().min(8).max(128),
});

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

export const updateUserPayload = z.object({
  first_name: z.string().min(1).max(255).optional(),
  last_name: z.string().min(1).max(255).optional(),
  role: z
    .string()
    .refine((value) => allowedRoles.includes(value))
    .optional(),
  phone_number: z.string().min(10).max(14).optional(),
  office: z.string().min(1).max(255).optional(),
});
