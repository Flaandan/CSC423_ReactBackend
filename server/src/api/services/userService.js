import { ServerError } from "../../error.js";
import { User } from "../models/user.js";
import {
  deleteUserDB,
  fetchAllUsersDB,
  fetchUserByIdDB,
  insertUserDB,
  updateUserDB,
  updateUserLastLoginDB,
  updateUserPasswordDB,
} from "../repositories/userRepository.js";
import { formatDate } from "../utils/formatDate.js";
import {
  computePasswordHashService,
  validateCredentialsService,
} from "./authService.js";

export async function updateUserLastLoginService(username) {
  const record = await updateUserLastLoginDB(username);

  if (!record) {
    throw new ServerError(
      `No user found with the username: ${username}`,
      404,
      "User could not be found",
    );
  }
}

export async function changeUserPasswordService(userDetails) {
  if (userDetails.current_password === userDetails.new_password) {
    throw new ServerError(
      `User '${userDetails.username}' submitted change password request with duplicate password`,
      400,
      "Passwords must be different",
    );
  }

  const credentials = {
    username: userDetails.username,
    password: userDetails.current_password,
  };

  await validateCredentialsService(credentials);

  const passwordHash = await computePasswordHashService(
    userDetails.new_password,
  );

  const updated = await updateUserPasswordDB(userDetails.id, passwordHash);

  if (!updated) {
    throw new ServerError(
      `BUG: Failed to update password for user: ${userDetails.username}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function getUserByIdService(id) {
  const record = await fetchUserByIdDB(id);

  if (!record) {
    throw new ServerError(
      `No user found with the id: ${id}`,
      404,
      "User could not be found",
    );
  }

  const user = new User.builder()
    .setId(record.id)
    .setFirstName(record.first_name)
    .setLastName(record.last_name)
    .setUsername(record.username)
    .setPasswordHash(record.password_hash)
    .setRole(record.role)
    .setPhoneNumber(record.phone_number)
    .setOffice(record.office)
    .setLastLogin(formatDate(record.last_login))
    .build();

  return user.toUserDTO();
}

export async function getAllUsersService() {
  const users = await fetchAllUsersDB();

  return users.map((userData) => {
    const user = new User.builder()
      .setId(userData.id)
      .setFirstName(userData.first_name)
      .setLastName(userData.last_name)
      .setUsername(userData.username)
      .setRole(userData.role)
      .setPhoneNumber(userData.phone_number)
      .setOffice(userData.office)
      .setLastLogin(formatDate(userData.last_login))
      .build();

    return user.toUserDTO();
  });
}

export async function createUserService(parsedPayload, passwordHash) {
  const user = new User.builder()
    .setFirstName(parsedPayload.first_name)
    .setLastName(parsedPayload.last_name)
    .setUsername(parsedPayload.username)
    .setPasswordHash(passwordHash)
    .setRole(parsedPayload.role)
    .setPhoneNumber(parsedPayload.phone_number)
    .setOffice(parsedPayload.office)
    .build();

  await insertUserDB(user);
}

export async function updateUserService(userDetails, parsedPayload) {
  if (parsedPayload.first_name) {
    userDetails.first_name = parsedPayload.first_name;
  }

  if (parsedPayload.last_name) {
    userDetails.last_name = parsedPayload.last_name;
  }

  if (parsedPayload.phone_number) {
    userDetails.phone_number = parsedPayload.phone_number;
  }

  if (parsedPayload.office) {
    userDetails.office = parsedPayload.office;
  }

  const record = await updateUserDB(userDetails);

  if (!record) {
    throw new ServerError(
      `No user found with the username: ${userDetails.username}`,
      404,
      "User could not be found",
    );
  }
}

export async function removeUserService(id) {
  const record = await deleteUserDB(id);

  if (!record) {
    throw new ServerError(
      `No user found with the id: ${id}`,
      404,
      "User could not be found",
    );
  }
}
