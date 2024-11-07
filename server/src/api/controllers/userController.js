import { User } from "../models/user.js";
import { computePasswordHash } from "../services/authService.js";
import {
  deleteUser,
  fetchAllUsers,
  fetchUserByUsername,
  insertUser,
  updateUser,
} from "../services/userService.js";
import { createUserPayload, updateUserPayload } from "../utils/schemas.js";

export async function apiCreateUser(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = createUserPayload.parse(payload);

  const passwordHash = await computePasswordHash(parsedPayload.password);

  const user = new User.builder()
    .setUsername(parsedPayload.username)
    .setFirstName(parsedPayload.first_name)
    .setLastName(parsedPayload.last_name)
    .setPasswordHash(passwordHash)
    .setRole(parsedPayload.role)
    .setPhoneNumber(parsedPayload.phone_number)
    .setOffice(parsedPayload.office)
    .build();

  await insertUser(user);

  return ctx.json({ success: "user created" }, 201);
}

export async function apiDeleteUser(ctx) {
  const username = ctx.req.param("username");

  await deleteUser(username);

  return ctx.json({ success: "user deleted" }, 200);
}

export async function apiGetAllUsers(ctx) {
  const userDTOs = await fetchAllUsers();

  return ctx.json({ users: userDTOs }, 200);
}

export async function apiGetUserByUsername(ctx) {
  const username = ctx.req.param("username");

  const userDTO = await fetchUserByUsername(username);

  return ctx.json({ user: userDTO }, 200);
}

export async function apiUpdateUser(ctx) {
  const username = ctx.req.param("username");

  const payload = await ctx.req.json();

  const parsedPayload = updateUserPayload.parse(payload);

  const user = await fetchUserByUsername(username);

  if (payload.first_name) {
    user.firstName = payload.first_name;
  }

  if (payload.last_name) {
    user.lastName = payload.last_name;
  }

  if (payload.role) {
    user.role = payload.role;
  }

  if (payload.phone_number) {
    user.phoneNumber = payload.phone_number;
  }

  if (payload.office) {
    user.office = payload.office;
  }

  await updateUser(user);

  return ctx.json({ success: "user updated" }, 200);
}
