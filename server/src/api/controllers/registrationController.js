import {
  fetchRegistrationsForUser,
  registerUserForCourse,
  unregisterUserFromCourse,
} from "../services/registrationService.js";
import { createRegistrationPayload } from "../utils/schemas.js";

export async function apiRegisterUserForCourse(ctx) {
  const { username } = ctx.req.param();

  const payload = await ctx.req.json();

  const parsedPayload = createRegistrationPayload.parse(payload);

  await registerUserForCourse(
    username,
    parsedPayload.course_discipline,
    parsedPayload.course_number,
    parsedPayload.semester_taken,
    parsedPayload.year_taken,
  );

  return ctx.json({ success: "user registered for course" }, 201);
}

export async function apiUnregisterUserFromCourse(ctx) {
  const { username, courseDiscipline, courseNumber } = ctx.req.param();

  await unregisterUserFromCourse(username, courseDiscipline, courseNumber);

  return ctx.json({ success: "user unregistered from course" }, 200);
}

export async function apiGetRegistrationsForUser(ctx) {
  const { username } = ctx.req.param();

  const registrations = await fetchRegistrationsForUser(username);

  return ctx.json({ registrations: registrations }, 200);
}
