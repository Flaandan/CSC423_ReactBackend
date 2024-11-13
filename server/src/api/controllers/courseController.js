import {
  createCourseService,
  getAllCoursesService,
  getCourseService,
  getUsersInCourseService,
  removeCourseService,
  updateCourseService,
} from "../services/courseService.js";
import {
  createCoursePayload,
  updateCoursePayload,
} from "../utils/validationSchemas.js";

export async function apiCreateCourse(ctx) {
  const majorId = ctx.req.param("majorId");
  const jwtPayload = ctx.get("jwtPayload");
  const payload = await ctx.req.json();
  const parsedPayload = createCoursePayload.parse(payload);

  const coursePayload = {
    id: jwtPayload.user_id,
    ...parsedPayload,
  };

  await createCourseService(coursePayload, majorId);

  return ctx.json({ success: "course created successfully" }, 201);
}

export async function apiRemoveCourse(ctx) {
  const courseId = ctx.req.param("courseId");

  await removeCourseService(courseId);

  return ctx.json({ success: "course removed successfully" }, 200);
}

export async function apiGetAllCourses(ctx) {
  const courses = await getAllCoursesService();

  return ctx.json({ courses: courses }, 200);
}

export async function apiGetCourseById(ctx) {
  const courseId = ctx.req.param("courseId");

  const course = await getCourseService(courseId);

  return ctx.json({ course: course }, 200);
}

export async function apiUpdateCourse(ctx) {
  const courseId = ctx.req.param("courseId");
  const jwtPayload = ctx.get("jwtPayload");
  const payload = await ctx.req.json();
  const parsedPayload = updateCoursePayload.parse(payload);

  const course = await getCourseService(courseId);

  await updateCourseService(course, parsedPayload, jwtPayload.user_id);

  return ctx.json({ success: "course updated successfully" }, 200);
}

export async function apiGetUsersInCourse(ctx) {
  const courseId = ctx.req.param("courseId");

  const users = await getUsersInCourseService(courseId);

  return ctx.json({ users: users }, 200);
}
