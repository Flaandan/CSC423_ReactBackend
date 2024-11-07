import { Major } from "../models/major.js";
import {
  addCourseToMajor,
  fetchCoursesForMajor,
  removeCourseFromMajor,
} from "../services/majorCoursesService.js";
import {
  deleteMajor,
  fetchAllMajors,
  fetchMajorByName,
  insertMajor,
  updateMajor,
} from "../services/majorService.js";
import {
  addMajorCoursePayload,
  createMajorPayload,
  updateMajorPayload,
} from "../utils/schemas.js";

export async function apiCreateMajor(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = createMajorPayload.parse(payload);

  const major = new Major.builder()
    .setName(parsedPayload.name)
    .setDescription(parsedPayload.description)
    .build();

  await insertMajor(major);

  return ctx.json({ success: "major created" }, 201);
}

export async function apiDeleteMajor(ctx) {
  const majorName = ctx.req.param("majorName");

  await deleteMajor(majorName);

  return ctx.json({ success: "major deleted" }, 200);
}

export async function apiGetAllMajors(ctx) {
  const majors = await fetchAllMajors();

  return ctx.json({ majors: majors }, 200);
}

export async function apiGetMajorByName(ctx) {
  const majorName = ctx.req.param("majorName");

  const major = await fetchMajorByName(majorName);

  return ctx.json({ major: major }, 200);
}

export async function apiUpdateMajor(ctx) {
  const majorName = ctx.req.param("majorName");

  const payload = await ctx.req.json();

  const parsedPayload = updateMajorPayload.parse(payload);

  const major = await fetchMajorByName(majorName);

  if (parsedPayload.name) {
    major.name = parsedPayload.name;
  }

  if (parsedPayload.description) {
    major.description = parsedPayload.description;
  }

  await updateMajor(major);

  return ctx.json({ success: "major updated" }, 200);
}

export async function apiAddCourseToMajor(ctx) {
  const { majorName } = ctx.req.param();

  const payload = await ctx.req.json();

  const parsedPayload = addMajorCoursePayload.parse(payload);

  await addCourseToMajor(
    majorName,
    parsedPayload.discipline,
    parsedPayload.course_number,
  );

  return ctx.json({ success: "course added to major" }, 200);
}

export async function apiRemoveCourseFromMajor(ctx) {
  const { majorName, courseDiscipline, courseNumber } = ctx.req.param();

  await removeCourseFromMajor(majorName, courseDiscipline, courseNumber);

  return ctx.json({ success: "course removed from major" }, 200);
}

export async function apiGetCoursesForMajor(ctx) {
  const { majorName } = ctx.req.param();

  const courses = await fetchCoursesForMajor(majorName);

  return ctx.json({ courses: courses }, 200);
}
