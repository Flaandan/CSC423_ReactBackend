import {
  apiCreateCourse,
  apiGetAllCourses,
  apiGetCourseById,
  apiGetUsersInCourse,
  apiRemoveCourse,
  apiUpdateCourse,
} from "../controllers/courseController.js";
import { jwtFilter } from "../middleware/jwtAuthFilter.js";
import { roleFilter } from "../middleware/roleCheckFilter.js";

export function courseRoutes(server) {
  server.on(
    "GET",
    "/api/v1/courses",
    jwtFilter(),
    async (ctx) => await apiGetAllCourses(ctx),
  );

  server.on(
    "POST",
    "/api/v1/courses/majors/:majorId",
    roleFilter(["TEACHER"]),
    async (ctx) => await apiCreateCourse(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/courses/:courseId",
    jwtFilter(),
    async (ctx) => await apiGetCourseById(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/courses/:courseId",
    roleFilter(["TEACHER"]),
    async (ctx) => await apiUpdateCourse(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/courses/:courseId",
    roleFilter(["TEACHER"]),
    async (ctx) => await apiRemoveCourse(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/courses/:courseId/users",
    roleFilter(["TEACHER", "ADMIN"]),
    async (ctx) => await apiGetUsersInCourse(ctx),
  );
}
