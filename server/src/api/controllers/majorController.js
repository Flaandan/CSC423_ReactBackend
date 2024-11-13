import {
  addCourseToMajorService,
  getCoursesForMajorService,
  removeCourseFromMajorService,
} from "../services/majorCourseService.js";
import {
  createMajorService,
  getAllMajorsService,
  getMajorByIdService,
  removeMajorService,
  updateMajorService,
} from "../services/majorService.js";
import {
  createMajorPayload,
  updateMajorPayload,
} from "../utils/validationSchemas.js";

export async function apiCreateMajor(ctx) {
  const payload = await ctx.req.json();
  const parsedPayload = createMajorPayload.parse(payload);

  await createMajorService(parsedPayload);

  return ctx.json({ success: "major created successfully" }, 201);
}

export async function apiDeleteMajor(ctx) {
  const majorId = ctx.req.param("majorId");

  await removeMajorService(majorId);

  return ctx.json({ success: "major deleted successfully" }, 200);
}

export async function apiGetAllMajors(ctx) {
  const majors = await getAllMajorsService();

  return ctx.json({ majors: majors }, 200);
}

export async function apiGetMajorById(ctx) {
  const majorId = ctx.req.param("majorId");

  const major = await getMajorByIdService(majorId);

  return ctx.json({ major: major }, 200);
}

export async function apiUpdateMajor(ctx) {
  const majorId = ctx.req.param("majorId");
  const payload = await ctx.req.json();
  const parsedPayload = updateMajorPayload.parse(payload);

  const major = await getMajorByIdService(majorId);

  const majorDetails = {
    id: majorId,
    ...major,
  };

  await updateMajorService(majorDetails, parsedPayload);

  return ctx.json({ success: "major updated successfully" }, 200);
}

export async function apiAddCourseToMajor(ctx) {
  const { majorId, courseId } = ctx.req.param();

  await addCourseToMajorService(majorId, courseId);

  return ctx.json({ success: "course added to major successfully" }, 200);
}

export async function apiRemoveCourseFromMajor(ctx) {
  const { majorId, courseId } = ctx.req.param();

  await removeCourseFromMajorService(majorId, courseId);

  return ctx.json({ success: "course removed from major successfully" }, 200);
}

export async function apiGetCoursesForMajor(ctx) {
  const majorId = ctx.req.param("majorId");

  const courses = await getCoursesForMajorService(majorId);

  return ctx.json({ courses: courses }, 200);
}
