import argon2 from "argon2";
import { ServerError } from "../../error.js";
import { fetchUserCredentialsDB } from "../repositories/authRepository.js";
import { updateUserLastLoginDB } from "../repositories/userRepository.js";

export async function validateCredentialsService(credentials) {
  // userDetails include id, username, and password_hash
  const userDetails = await fetchUserCredentialsDB(credentials.username);

  if (!userDetails) {
    throw new ServerError(
      `Failed to find user associated with username: ${credentials.username}`,
      401,
      "INVALID_CREDENTIALS",
    );
  }

  const isVerified = await verifyPasswordHashService(
    userDetails.password_hash,
    credentials.password.trim(),
  );

  if (!isVerified) {
    throw new ServerError(
      `Failed to verify password for user: ${userDetails.username}`,
      401,
      "INVALID_CREDENTIALS",
    );
  }

  const updated = await updateUserLastLoginDB(userDetails.id);

  if (!updated) {
    throw new ServerError(
      `BUG: Failed to find user associated with username: ${credentials.username} when updating last login`,
      500,
      "SERVICE_ERROR",
    );
  }

  return userDetails;
}

async function verifyPasswordHashService(
  expectedPasswordHash,
  passwordCandidate,
) {
  try {
    return await argon2.verify(expectedPasswordHash, passwordCandidate);
  } catch (err) {
    throw new ServerError(
      `Failed to verify against password hash: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function computePasswordHashService(password) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  } catch (err) {
    throw new ServerError(
      `Failed to compute password hash: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
