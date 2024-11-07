import {
  apiGetRegistrationsForUser,
  apiRegisterUserForCourse,
  apiUnregisterUserFromCourse,
} from "../controllers/registrationController.js";
import {
  apiAssignMajorToUser,
  apiCreateUser,
  apiDeleteUser,
  apiGetAllUsers,
  apiGetMajorsForUser,
  apiGetUserByUsername,
  apiRemoveMajorFromUser,
  apiUpdateUser,
} from "../controllers/userController.js";

export function userRoutes(server) {
  server.on("GET", "/api/v1/users", async (ctx) => await apiGetAllUsers(ctx));

  server.on("POST", "/api/v1/users", async (ctx) => await apiCreateUser(ctx));

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/users/:username",
    async (ctx) => await apiGetUserByUsername(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/users/:username",
    async (ctx) => await apiUpdateUser(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/users/:username",
    async (ctx) => await apiDeleteUser(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "POST",
    "/api/v1/users/:username/majors",
    async (ctx) => await apiAssignMajorToUser(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/users/:username/majors/:majorName",
    async (ctx) => await apiRemoveMajorFromUser(ctx),
  );

  server.on(
    "GET",
    "/api/v1/users/:username/majors",
    async (ctx) => await apiGetMajorsForUser(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "POST",
    "/api/v1/users/:username/courses",
    async (ctx) => await apiRegisterUserForCourse(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/users/:username/courses/:courseDiscipline/:courseNumber",
    async (ctx) => await apiUnregisterUserFromCourse(ctx),
  );

  server.on(
    "GET",
    "/api/v1/users/:username/courses",
    async (ctx) => await apiGetRegistrationsForUser(ctx),
  );
}
