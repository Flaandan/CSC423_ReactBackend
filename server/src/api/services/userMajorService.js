import { ServerError } from "../../error.js";
import {
  deleteMajorFromUserDB,
  fetchMajorsForUserDB,
  insertMajorToUserDB,
} from "../repositories/userMajorRepository.js";

export async function addMajorToUserService(userId, majorId, token) {
  if (token.user_role === "STUDENT") {
    if (token.user_id !== userId) {
      throw new ServerError(
        `Student with ID ${token.user_id} attempted to assign major to student with ID ${userId}`,
        403,
        "INVALID_ROLE",
      );
    }
  }

  await insertMajorToUserDB(userId, majorId);
}

export async function removeMajorFromUserService(userId, majorId, token) {
  if (token.user_role === "STUDENT") {
    if (token.user_id !== userId) {
      throw new ServerError(
        `Student with ID ${token.user_id} attempted to remove major from student with ID ${userId}`,
        403,
        "INVALID_ROLE",
      );
    }
  }

  const result = await deleteMajorFromUserDB(userId, majorId);

  if (!result) {
    throw new ServerError(
      `User with ID ${userId} is not assigned to major with ID ${majorId}`,
      404,
      "The user is not assigned to this major",
    );
  }
}

export async function getMajorsForUserService(userId, token) {
  if (token.user_role === "STUDENT") {
    if (token.user_id !== userId) {
      throw new ServerError(
        `Student with ID ${token.user_id} attempted to get major from student with ID ${userId}`,
        403,
        "INVALID_ROLE",
      );
    }
  }

  const majors = await fetchMajorsForUserDB(userId);

  if (!majors) {
    throw new ServerError(
      `User with ID ${userId} does not exist`,
      404,
      "NOT_FOUND",
    );
  }

  return majors;
}
