import pg from "pg";
import { pgPool } from "../db.js";
import { ClientError, ServerError } from "../error.js";
import { computePasswordHash, validateCredentials } from "./authService.js";

export async function insertUser(user) {
  try {
    await pgPool.query(
      `
         INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         `,
      [
        user.username,
        user.firstName,
        user.lastName,
        user.passwordHash,
        user.role,
        user.phoneNumber,
        user.office,
      ],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      // Duplicate key violation
      if (err.code === "23505") {
        throw new ServerError(
          `Username is already in use: ${String(err)}`,
          409,
          ClientError.USER_CONFLICT,
        );
      }
    }

    throw new ServerError(
      `Failed to insert user into database: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function changeUserPassword(payload) {
  const credentials = {
    username: payload.username,
    password: payload.current_password,
  };

  // Throw away return value
  await validateCredentials(credentials);

  const passwordHash = await computePasswordHash(payload.new_password);

  try {
    await pgPool.query(
      `
        UPDATE users 
        SET password_hash = $1 
        WHERE username = $2
        `,
      [passwordHash, payload.username],
    );
  } catch (err) {
    throw new ServerError(
      `Failed to update users password in database: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
