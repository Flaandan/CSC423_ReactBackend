import { z } from "zod";

const allowedRoles = ["STUDENT", "ADMIN", "INSTRUCTOR"];

const semesters = ["FALL", "WINTER", "SPRING", "SUMMER"];

export const createRegistrationPayload = z.object({
  course_discipline: z.string().min(1).max(10),
  course_number: z.number().int().positive(),
  semester_taken: z.string().refine((value) => {
    return semesters.includes(value);
  }),
  year_taken: z.number().int().min(1900).max(2100),
});

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

export const createMajorPayload = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
});

<<<<<<< HEAD
export const addUserMajorPayload = z.object({
  major_name: z.string().min(1).max(255),
});

export const addMajorCoursePayload = z.object({
  discipline: z.string().min(1).max(10),
  course_number: z.number().int().positive(),
});

=======
>>>>>>> 7ad3c6a (updated init_db script to also seed courses and majors, created routes, controller, and service for major, updated schema)
export const updateMajorPayload = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(255).optional(),
});
<<<<<<< HEAD

export const createCoursePayload = z.object({
  discipline: z.string().min(1).max(10),
  course_number: z.number().int().positive(),
  description: z.string().min(1).max(255),
  max_capacity: z.number().int().positive(),
});

export const updateCoursePayload = z.object({
  description: z.string().min(1).max(255).optional(),
  max_capacity: z.number().int().positive().optional(),
});
=======
>>>>>>> 7ad3c6a (updated init_db script to also seed courses and majors, created routes, controller, and service for major, updated schema)
