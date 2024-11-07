import {
  apiAddCourseToMajor,
  apiCreateMajor,
  apiDeleteMajor,
  apiGetAllMajors,
  apiGetCoursesForMajor,
  apiGetMajorByName,
  apiRemoveCourseFromMajor,
  apiUpdateMajor,
} from "../controllers/majorController.js";

export function majorRoutes(server) {
  server.on("GET", "/api/v1/majors", async (ctx) => await apiGetAllMajors(ctx));

  server.on("POST", "/api/v1/majors", async (ctx) => await apiCreateMajor(ctx));

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/majors/:majorName",
    async (ctx) => await apiGetMajorByName(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/majors/:majorName",
    async (ctx) => await apiUpdateMajor(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/majors/:majorName",
    async (ctx) => await apiDeleteMajor(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "POST",
    "/api/v1/majors/:majorName/courses",
    async (ctx) => await apiAddCourseToMajor(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/majors/:majorName/courses/:courseDiscipline/:courseNumber",
    async (ctx) => await apiRemoveCourseFromMajor(ctx),
  );

  server.on(
    "GET",
    "/api/v1/majors/:majorName/courses",
    async (ctx) => await apiGetCoursesForMajor(ctx),
  );
}
