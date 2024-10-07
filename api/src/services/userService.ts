import pg from "pg";
import { pgPool } from "../db.js";
import { ClientError, ServerError } from "../error.js";
import { CreateUserSchema } from "../utils/types.js";

async function insertUser(
  payload: CreateUserSchema,
  password_hash: string,
): Promise<void> {
  await pgPool
    .query(
      `
    INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        payload.username,
        payload.first_name,
        payload.last_name,
        password_hash,
        payload.role,
        payload.phone_number,
        payload.office ? payload.office : "Student Lounge",
      ],
    )
    .catch((err) => {
      if (err instanceof pg.DatabaseError) {
        // Code for duplicate key violation error
        if (err.code === "23505") {
          throw new ServerError(
            `Username is already in use: ${String(err)}`,
            409,
            ClientError.CONFLICT,
          );
        }
      }

      throw new ServerError(
        `Failed to insert user into database: ${String(err)}`,
        500,
        ClientError.SERVICE_ERROR,
      );
    });
}

export { insertUser };
