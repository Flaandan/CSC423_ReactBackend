import { z } from "zod";

export const userRoles = ["STUDENT", "ADMIN", "TEACHER"];
export const courseStatus = ["ACTIVE", "INACTIVE"];
export const registrationStatus = ["ENROLLED", "UNENROLLED"];
export const semesters = ["FALL", "WINTER", "SPRING", "SUMMER"];

// User creation payload
export const createUserPayload = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "First name must not be empty" })
      .max(100, { message: "First name must be less than 100 characters" }),

    last_name: z
      .string()
      .min(1, { message: "Last name must not be empty" })
      .max(100, { message: "Last name must be less than 100 characters" }),

    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(25, { message: "Username must be less than 25 characters" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(128, { message: "Password must be less than 128 characters" }),

    role: z.string().refine((value) => userRoles.includes(value), {
      message: "Role must be one of 'STUDENT', 'ADMIN', 'TEACHER'",
    }),

    phone_number: z
      .string()
      .min(10, { message: "Phone number must be at least 10 characters" })
      .max(15, { message: "Phone number must be less than 15 characters" }),

    office: z
      .string()
      .min(1, { message: "Office must not be empty" })
      .max(100, { message: "Office must be less than 100 characters" })
      .optional(),
  })
  .strict();

// Update user payload
export const updateUserPayload = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "First name must not be empty" })
      .max(100, { message: "First name must be less than 100 characters" })
      .optional(),

    last_name: z
      .string()
      .min(1, { message: "Last name must not be empty" })
      .max(100, { message: "Last name must be less than 100 characters" })
      .optional(),

    phone_number: z
      .string()
      .min(10, { message: "Phone number must be at least 10 characters" })
      .max(15, { message: "Phone number must be less than 15 characters" })
      .optional(),

    office: z
      .string()
      .min(1, { message: "Office must not be empty" })
      .max(100, { message: "Office must be less than 100 characters" })
      .optional(),
  })
  .strict(); // This will throw an error for any extra fields

// Course creation payload
export const createCoursePayload = z
  .object({
    course_discipline: z
      .string()
      .min(1, { message: "Course discipline must not be empty" })
      .max(10, {
        message: "Course discipline must be less than 10 characters",
      }),

    course_number: z
      .number()
      .int()
      .min(100, { message: "Course number must be at least 100" })
      .max(999, { message: "Course number must be at most 999" }),

    description: z
      .string()
      .min(1, { message: "Description must not be empty" })
      .max(255, { message: "Description must be less than 255 characters" }),

    max_capacity: z
      .number()
      .int()
      .positive()
      .min(0, { message: "Max capacity must be at least 0" })
      .max(35, { message: "Max capacity must be at most 35" }),
  })
  .strict();

// Course update payload
export const updateCoursePayload = z
  .object({
    teacher_id: z.string().optional(),

    course_discipline: z
      .string()
      .min(1, { message: "Course discipline must not be empty" })
      .max(10, { message: "Course discipline must be less than 10 characters" })
      .optional(),

    course_number: z
      .number()
      .int()
      .min(100, { message: "Course number must be at least 100" })
      .max(999, { message: "Course number must be at most 999" })
      .optional(),

    description: z
      .string()
      .min(1, { message: "Description must not be empty" })
      .max(255, { message: "Description must be less than 255 characters" })
      .optional(),

    max_capacity: z
      .number()
      .int()
      .positive()
      .min(0, { message: "Max capacity must be at least 0" })
      .max(35, { message: "Max capacity must be at most 35" })
      .optional(),

    status: z
      .string()
      .refine((value) => courseStatus.includes(value), {
        message: "Status must be one of 'ACTIVE', 'INACTIVE'",
      })
      .optional(),
  })
  .strict();

// Registration creation payload
export const createRegistrationPayload = z
  .object({
    semester_taken: z.string().refine((value) => semesters.includes(value), {
      message: "Semester must be one of 'FALL', 'WINTER', 'SPRING', 'SUMMER'",
    }),

    year_taken: z
      .number()
      .int()
      .min(2024, { message: "Year must be 2024 or later" })
      .max(2150, { message: "Year must be no later than 2150" }),
  })
  .strict();

// Login payload
export const logInPayload = z
  .object({
    username: z.string().min(1, { message: "Username must not be empty" }),

    password: z.string().min(1, { message: "Password must not be empty" }),
  })
  .strict();

// Change password payload
export const changePasswordPayload = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Current password must not be empty" }),

    new_password: z
      .string()
      .min(8, { message: "New password must be more than 8 characters" })
      .max(128, { message: "New password must be less than 128 characters" }),
  })
  .strict();

// Major creation payload
export const createMajorPayload = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name must not be empty" })
      .max(100, { message: "Name must be less than 100 characters" }),

    description: z
      .string()
      .min(1, { message: "Description must not be empty" })
      .max(255, { message: "Description must be less than 255 characters" }),
  })
  .strict();

// Major update payload
export const updateMajorPayload = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name must not be empty" })
      .max(100, { message: "Name must be less than 100 characters" })
      .optional(),

    description: z
      .string()
      .min(1, { message: "Description must not be empty" })
      .max(255, { message: "Description must be less than 255 characters" })
      .optional(),
  })
  .strict();
