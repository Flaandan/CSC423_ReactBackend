import argon2 from "argon2";
import { pgPool } from "../db.js";
import { ClientError, ServerError } from "../error.js";
import { User } from "../models/user.js";

async function validateCredentials(payload) {
  // When attempting to validate credentials, passing an incorrect username and password takes
  // and order of magnitude less of time then with a correct username and incorrect password
  //
  // fallbackPasswordHash is used so that the same operations, getting credentials and verifying
  // password, always happen and no notable time difference can be observed
  //
  // Ex. Timing attacks (side-channel attack)

  const fallbackPasswordHash =
    "$argon2id$v=19$m=65536,t=3,p=1$gZiV/M1gPc22ElAH/Jh1Hw$CWOrkoo7oJBQ/iyh7uJ0LO2aLEfrHwTWllSAxT0zRno";

  const userDetails = await getUserDetails(payload.username);

  const isVerified = await verifyPasswordHash(
    userDetails.password_hash || fallbackPasswordHash,
    payload.password,
  );

  if (!isVerified) {
    if (!userDetails.password_hash) {
      // If the username was not found
      throw new ServerError(
        `Failed to find user associated with username: ${payload.username}`,
        401,
        ClientError.INVALID_CREDENTIALS,
      );
    } else {
      // If the username exists but the password is incorrect
      throw new ServerError(
        `Failed to verify password for user: ${payload.username}`,
        401,
        ClientError.INVALID_CREDENTIALS,
      );
    }
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

async function getUserDetails(username) {
  try {
    const row = await pgPool.query(
      `
            SELECT username, first_name, last_name, password_hash, role, phone_number, office
            FROM users
            WHERE username = $1
            `,
      [username],
    );

    // Return null if user not found
    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
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
