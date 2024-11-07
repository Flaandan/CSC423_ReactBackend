import {
<<<<<<< HEAD
  apiAddCourseToMajor,
  apiCreateMajor,
  apiDeleteMajor,
  apiGetAllMajors,
  apiGetCoursesForMajor,
  apiGetMajorByName,
  apiRemoveCourseFromMajor,
=======
  apiCreateMajor,
  apiDeleteMajor,
  apiGetAllMajors,
  apiGetMajorByName,
>>>>>>> 7ad3c6a (updated init_db script to also seed courses and majors, created routes, controller, and service for major, updated schema)
  apiUpdateMajor,
} from "../controllers/majorController.js";

export function majorRoutes(server) {
  server.on("GET", "/api/v1/majors", async (ctx) => await apiGetAllMajors(ctx));

  server.on("POST", "/api/v1/majors", async (ctx) => await apiCreateMajor(ctx));

<<<<<<< HEAD
  // -----------------------------------------------------------------------
=======
>>>>>>> 7ad3c6a (updated init_db script to also seed courses and majors, created routes, controller, and service for major, updated schema)
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
<<<<<<< HEAD

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
=======
>>>>>>> 7ad3c6a (updated init_db script to also seed courses and majors, created routes, controller, and service for major, updated schema)
}
