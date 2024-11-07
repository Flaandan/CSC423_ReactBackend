import { Course } from "../models/course.js";
import {
  deleteCourse,
  fetchAllCourses,
  fetchCourseByDisciplineAndNumber,
  insertCourse,
  updateCourse,
} from "../services/courseService.js";
import { createCoursePayload, updateCoursePayload } from "../utils/schemas.js";

export async function apiCreateCourse(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = createCoursePayload.parse(payload);

  const course = new Course.builder()
    .setDiscipline(parsedPayload.discipline)
    .setCourseNumber(parsedPayload.course_number)
    .setDescription(parsedPayload.description)
    .setMaxCapacity(parsedPayload.max_capacity)
    .build();

  await insertCourse(course);

  return ctx.json({ success: "course created" }, 201);
}

export async function apiDeleteCourse(ctx) {
  const { discipline, courseNumber } = ctx.req.param();

  await deleteCourse(discipline, courseNumber);

  return ctx.json({ success: "course deleted" }, 200);
}

export async function apiGetAllCourses(ctx) {
  const courses = await fetchAllCourses();

  return ctx.json({ courses: courses }, 200);
}

export async function apiGetCourseByDisciplineAndNumber(ctx) {
  const { discipline, courseNumber } = ctx.req.param();

  const course = await fetchCourseByDisciplineAndNumber(
    discipline,
    courseNumber,
  );

  return ctx.json({ course: course }, 200);
}

export async function apiUpdateCourse(ctx) {
  const { discipline, courseNumber } = ctx.req.param();

  const payload = await ctx.req.json();

  const parsedPayload = updateCoursePayload.parse(payload);

  const course = await fetchCourseByDisciplineAndNumber(
    discipline,
    courseNumber,
  );

  if (parsedPayload.description) {
    course.description = parsedPayload.description;
  }

  if (parsedPayload.max_capacity) {
    course.max_capacity = parsedPayload.max_capacity;
  }

  await updateCourse(course);

  return ctx.json({ success: "course updated" }, 200);
}
