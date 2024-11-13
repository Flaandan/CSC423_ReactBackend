import { computePasswordHashService } from "../services/authService.js";
import {
  changeUserRegistrationStatusService,
  getAllRegistrationsForUserService,
  registerUserForCourseService,
} from "../services/registrationService.js";
import {
  addMajorToUserService,
  getMajorsForUserService,
  removeMajorFromUserService,
} from "../services/userMajorService.js";
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  removeUserService,
  updateUserService,
} from "../services/userService.js";
import {
  createRegistrationPayload,
  createUserPayload,
  updateUserPayload,
} from "../utils/validationSchemas.js";

export async function apiCreateUser(ctx) {
  const payload = await ctx.req.json();
  const parsedPayload = createUserPayload.parse(payload);

  const passwordHash = await computePasswordHashService(parsedPayload.password);

  await createUserService(parsedPayload, passwordHash);

  return ctx.json({ success: "user created successfully" }, 201);
}

export async function apiDeleteUser(ctx) {
  const userId = ctx.req.param("userId");

  await removeUserService(userId);

  return ctx.json({ success: "user deleted successfully" }, 200);
}

export async function apiGetAllUsers(ctx) {
  const userDTOs = await getAllUsersService();

  return ctx.json({ users: userDTOs }, 200);
}

export async function apiGetUserById(ctx) {
  const userId = ctx.req.param("userId");

  const userDTO = await getUserByIdService(userId);

  return ctx.json({ user: userDTO }, 200);
}

export async function apiUpdateUser(ctx) {
  const userId = ctx.req.param("userId");
  const payload = await ctx.req.json();
  const parsedPayload = updateUserPayload.parse(payload);

  const userDTO = await getUserByIdService(userId);

  const userDetails = {
    id: userId,
    ...userDTO,
  };

  await updateUserService(userDetails, parsedPayload);

  return ctx.json({ success: "user updated successfully" }, 200);
}

export async function apiAssignMajorToUser(ctx) {
  const { userId, majorId } = ctx.req.param();
  const jwtPayload = ctx.get("jwtPayload");

  await addMajorToUserService(userId, majorId, jwtPayload);

  return ctx.json({ success: "major assigned to user successfully" }, 200);
}

export async function apiRemoveMajorFromUser(ctx) {
  const { userId, majorId } = ctx.req.param();
  const jwtPayload = ctx.get("jwtPayload");

  await removeMajorFromUserService(userId, majorId, jwtPayload);

  return ctx.json({ success: "major removed from user successfully" }, 200);
}

export async function apiGetMajorsForUser(ctx) {
  const userId = ctx.req.param("userId");
  const jwtPayload = ctx.get("jwtPayload");

  const majors = await getMajorsForUserService(userId, jwtPayload);

  return ctx.json({ majors: majors }, 200);
}

export async function apiRegisterUserForCourse(ctx) {
  const { userId, courseId } = ctx.req.param();
  const payload = await ctx.req.json();
  const jwtPayload = ctx.get("jwtPayload");
  const parsedPayload = createRegistrationPayload.parse(payload);

  await registerUserForCourseService(
    userId,
    courseId,
    parsedPayload.semester_taken,
    parsedPayload.year_taken,
    jwtPayload,
  );

  return ctx.json({ success: "user registered for course successfully" }, 201);
}

export async function apiUnregisterUserFromCourse(ctx) {
  const { userId, courseId } = ctx.req.param();
  const jwtPayload = ctx.get("jwtPayload");

  await changeUserRegistrationStatusService(userId, courseId, jwtPayload);

  return ctx.json(
    { success: "user unregistered from course successfully" },
    200,
  );
}

export async function apiGetRegistrationsForUser(ctx) {
  const userId = ctx.req.param("userId");
  const jwtPayload = ctx.get("jwtPayload");

  const courses = await getAllRegistrationsForUserService(userId, jwtPayload);

  return ctx.json({ courses: courses }, 200);
}
