import argon2 from "argon2";
import { QueryResult } from "pg";
import { pgPool } from "../db.js";
import { ClientError, ServerError } from "../error.js";
import { User } from "../models/user.js";
import { LoginSchema } from "../controllers/auth/login.js";

async function validateCredentials(payload: LoginSchema): Promise<void> {
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
  const row: QueryResult<User> = await pgPool
    .query(
      `
      SELECT password_hash
      FROM users
      WHERE username = $1
      `,
      [username],
    )
    .catch((err) => {
      throw new ServerError(
        `Failed to fetch user credentials from database: ${String(err)}`,
        500,
        ClientError.SERVICE_ERROR,
      );
    });

  if (row.rows.length > 0) {
    return row.rows[0].password_hash;
  }

  // Return null if username not found
  return null;
}

async function verifyPasswordHash(
  expectedPasswordHash: string,
  passwordCandidate: string,
): Promise<boolean> {
  const isVerified = await argon2
    .verify(expectedPasswordHash, passwordCandidate)
    .catch((err) => {
      throw new ServerError(
        `Failed to verify against password hash: ${String(err)}`,
        500,
        ClientError.SERVICE_ERROR,
      );
    });

  return isVerified;
}

async function computePasswordHash(password: string): Promise<string> {
  const hashedPassword = await argon2
    .hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // (65536 KiB)
      timeCost: 3, // (number of iterations)
      parallelism: 1, // (parallel execution threads)
    })
    .catch((err) => {
      throw new ServerError(
        `Failed to compute password hash: ${String(err)}`,
        500,
        ClientError.SERVICE_ERROR,
      );
    });

  return hashedPassword;
}

export { computePasswordHash, validateCredentials };
