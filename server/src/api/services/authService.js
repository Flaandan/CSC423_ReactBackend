import argon2 from "argon2";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";
import { User } from "../models/user.js";
import { formatDate } from "../utils/formatDate.js";
import { updateUserLastLogin } from "./userService.js";

export async function validateCredentials(payload) {
  const userDetails = await getUserCredentials(payload.username);

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
    payload.password.trim(),
  );

  if (!isVerified) {
    // If the username exists but the password is incorrect
    throw new ServerError(
      `Failed to verify password for user: ${payload.username}`,
      401,
      ClientError.INVALID_CREDENTIALS,
    );
  }

  await updateUserLastLogin(userDetails.username);

  return userDetails.username;
}

async function getUserCredentials(username) {
  try {
    const row = await pgPool.query(
      `
        SELECT username, password_hash
        FROM users
        WHERE username = $1
      `,
      [username],
    );

    // Null if user not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record)
      throw new ServerError(
        `No user found with the username: ${username}`,
        401,
        ClientError.INVALID_CREDENTIALS,
      );

    return record;
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to fetch credentials for user ${username} : ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
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

export async function computePasswordHash(password) {
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
