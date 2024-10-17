import argon2 from "argon2";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";
import { User } from "../../models/user.js";
import { getUserByUsername } from "./userService.js";

async function validateCredentials(payload) {
  const userDetails = await getUserByUsername(payload.username);

  if (!userDetails) {
    // If the username was not found
    throw new ServerError(
      `Failed to find user associated with username: ${payload.username}`,
      401,
      ClientError.INVALID_CREDENTIALS,
    );
  }

  const isVerified = await verifyPasswordHash(
    userDetails.password_hash,
    payload.password,
  );

  if (!isVerified) {
    // If the username exists but the password is incorrect
    throw new ServerError(
      `Failed to verify password for user: ${payload.username}`,
      401,
      ClientError.INVALID_CREDENTIALS,
    );
  }

  await updateLastLogin(userDetails.username);

  const user = new User.builder()
    .setUsername(userDetails.username)
    .setFirstName(userDetails.first_name)
    .setLastName(userDetails.last_name)
    .setPasswordHash(userDetails.password_hash)
    .setRole(userDetails.role)
    .setPhoneNumber(userDetails.phone_number)
    .setOffice(userDetails.office)
    .build();

  return user.toUserDTO();
}

async function verifyPasswordHash(expectedPasswordHash, passwordCandidate) {
  try {
    const isVerified = await argon2.verify(
      expectedPasswordHash,
      passwordCandidate,
    );
    return isVerified;
  } catch (err) {
    throw new ServerError(
      `Failed to verify against password hash: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

async function updateLastLogin(username) {
  try {
    await pgPool.query(
      `
      UPDATE users
      SET last_login = NOW()
      WHERE username = $1
    `,
      [username],
    );
  } catch (err) {
    throw new ServerError(
      `Failed to update last login timestamp for user ${username}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

async function computePasswordHash(password) {
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // (65536 KiB)
      timeCost: 3, // (number of iterations)
      parallelism: 1, // (parallel execution threads)
    });

    return hashedPassword;
  } catch (err) {
    throw new ServerError(
      `Failed to compute password hash: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export { computePasswordHash, validateCredentials };
