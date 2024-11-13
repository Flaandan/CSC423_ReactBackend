import {
  apiAssignMajorToUser,
  apiCreateUser,
  apiDeleteUser,
  apiGetAllUsers,
  apiGetMajorsForUser,
  apiGetRegistrationsForUser,
  apiGetUserById,
  apiRegisterUserForCourse,
  apiRemoveMajorFromUser,
  apiUnregisterUserFromCourse,
  apiUpdateUser,
} from "../controllers/userController.js";
import { jwtFilter } from "../middleware/jwtAuthFilter.js";
import { roleFilter } from "../middleware/roleCheckFilter.js";

export function userRoutes(server) {
  server.on(
    "GET",
    "/api/v1/users",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiGetAllUsers(ctx),
  );

  server.on(
    "POST",
    "/api/v1/users",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiCreateUser(ctx),
  );

  // -----------------------------------------------------------------------
  server.on(
    "GET",
    "/api/v1/users/:userId",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiGetUserById(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/users/:userId",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiUpdateUser(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/users/:userId",
    roleFilter(["ADMIN"]),
    async (ctx) => await apiDeleteUser(ctx),
  );

  // -----------------------------------------------------------------------
  // User id path parameter will be checked against the user id within the user's JWT
  server.on(
    "POST",
    "/api/v1/users/:userId/majors/:majorId",
    roleFilter(["STUDENT", "ADMIN"]),
    async (ctx) => await apiAssignMajorToUser(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/users/:userId/majors/:majorId",
    roleFilter(["STUDENT", "ADMIN"]),
    async (ctx) => await apiRemoveMajorFromUser(ctx),
  );

  server.on(
    "GET",
    "/api/v1/users/:userId/majors",
    roleFilter(["STUDENT", "ADMIN"]),
    async (ctx) => await apiGetMajorsForUser(ctx),
  );

  // -----------------------------------------------------------------------
  // User id path parameter will be checked against the user id within the user's JWT
  server.on(
    "POST",
    "/api/v1/users/:userId/courses/:courseId",
    roleFilter(["STUDENT", "ADMIN"]),
    async (ctx) => await apiRegisterUserForCourse(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/users/:userId/courses/:courseId",
    roleFilter(["STUDENT", "ADMIN"]),
    async (ctx) => await apiUnregisterUserFromCourse(ctx),
  );

  server.on(
    "GET",
    "/api/v1/users/:userId/courses",
    roleFilter(["STUDENT", "ADMIN"]),
    async (ctx) => await apiGetRegistrationsForUser(ctx),
  );
}
