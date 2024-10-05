import argon2 from "argon2";
import { QueryResult } from "pg";
import { LogInSchema } from "../controllers/login.js";
import { pgPool } from "../db.js";
import { ClientError, ServerError } from "../error.js";
import { User } from "../models/user.js";

async function validateCredentials(payload: LogInSchema): Promise<void> {
  // When attempting to validate credentials, passing an incorrect username and password takes
  // and order of magnitude less of time then with a correct username and incorrect password
  //
  // Fallback fallbackPasswordHash is used so that the same operations happen during
  // each scenario and no notable time difference can be observed
  //
  // Ex. Timing attacks (side-channel attack)
  const fallbackPasswordHash: string =
    "$argon2id$v=19$m=65536,t=3,p=1$gZiV/M1gPc22ElAH/Jh1Hw$CWOrkoo7oJBQ/iyh7uJ0LO2aLEfrHwTWllSAxT0zRno";

  const storedPasswordHash = await getCredentials(payload.username);

  const isVerified = await verifyPasswordHash(
    storedPasswordHash || fallbackPasswordHash,
    payload.password,
  );

  if (!isVerified) {
    if (!storedPasswordHash) {
      // If the username was not found
      throw new ServerError(
        "Failed to find user associated with username",
        401,
        ClientError.INVALID_CREDENTIALS,
      );
    } else {
      // If the username exists but the password is incorrect
      throw new ServerError(
        "Failed to verify password",
        401,
        ClientError.INVALID_CREDENTIALS,
      );
    }
  }
}

async function getCredentials(username: string): Promise<string | null> {
  try {
    const row: QueryResult<User> = await pgPool.query(
      `
      SELECT password_hash
      FROM users
      WHERE username = $1
      `,
      [username],
    );

    if (row.rows.length > 0) {
      return row.rows[0].password_hash;
    }

    // Return null if username not found
    return null;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch user credentials from database: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

async function verifyPasswordHash(
  expectedPasswordHash: string,
  passwordCandidate: string,
): Promise<boolean> {
  // Will throw Error if it internally fails
  const isVerified = await argon2.verify(
    expectedPasswordHash,
    passwordCandidate,
  );

  return isVerified;
}

async function computePasswordHash(password: string): Promise<string> {
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
