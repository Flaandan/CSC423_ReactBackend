import {
  apiCreateCourse,
  apiDeleteCourse,
  apiGetAllCourses,
  apiGetCourseByDisciplineAndNumber,
  apiGetUsersInCourse,
  apiUpdateCourse,
} from "../controllers/courseController.js";

export function courseRoutes(server) {
  server.on(
    "GET",
    "/api/v1/courses",
    async (ctx) => await apiGetAllCourses(ctx),
  );

  server.on(
    "POST",
    "/api/v1/courses",
    async (ctx) => await apiCreateCourse(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/courses/:courseDiscipline/:courseNumber",
    async (ctx) => await apiGetCourseByDisciplineAndNumber(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/courses/:courseDiscipline/:courseNumber",
    async (ctx) => await apiUpdateCourse(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/courses/:courseDiscipline/:courseNumber",
    async (ctx) => await apiDeleteCourse(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/courses/:courseDiscipline/:courseNumber/users",
    async (ctx) => await apiGetUsersInCourse(ctx),
  );
}
