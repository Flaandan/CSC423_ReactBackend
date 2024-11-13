import {
  apiAddCourseToMajor,
  apiCreateMajor,
  apiDeleteMajor,
  apiGetAllMajors,
  apiGetCoursesForMajor,
  apiGetMajorById,
  apiRemoveCourseFromMajor,
  apiUpdateMajor,
} from "../controllers/majorController.js";
import { jwtFilter } from "../middleware/jwtAuthFilter.js";
import { roleFilter } from "../middleware/roleCheckFilter.js";

export function majorRoutes(server) {
  server.on(
    "GET",
    "/api/v1/majors",
    jwtFilter(),
    async (ctx) => await apiGetAllMajors(ctx),
  );

  server.on(
    "POST",
    "/api/v1/majors",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiCreateMajor(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/majors/:majorId",
    jwtFilter(),
    async (ctx) => await apiGetMajorById(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/majors/:majorId",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiUpdateMajor(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/majors/:majorId",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiDeleteMajor(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "POST",
    "/api/v1/majors/:majorId/courses/:courseId",
    roleFilter(["ADMIN", "TEACHER"]),
    async (ctx) => await apiAddCourseToMajor(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/majors/:majorId/courses/:courseId",
    roleFilter(["ADMIN", "TEACHER"]),
    async (ctx) => await apiRemoveCourseFromMajor(ctx),
  );

  server.on(
    "GET",
    "/api/v1/majors/:majorId/courses",
    jwtFilter(),
    async (ctx) => await apiGetCoursesForMajor(ctx),
  );
}
