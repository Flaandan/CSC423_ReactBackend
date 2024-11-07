import pg from "pg";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";

export async function addMajorToUser(username, majorName) {
  try {
    await pgPool.query(
      `
      INSERT INTO user_majors (username, major_name)
      VALUES ($1, $2)
      `,
      [username, majorName],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "23503") {
        if (err.detail.includes("username")) {
          // Foreign key violation due to invalid username
          throw new ServerError(
            `User ${username} does not exist`,
            404,
            ClientError.NOT_FOUND,
          );
        }
        if (err.detail.includes("major_name")) {
          // Foreign key violation due to invalid major name
          throw new ServerError(
            `Major ${majorName} does not exist`,
            404,
            ClientError.NOT_FOUND,
          );
        }
      }

      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `User ${username} is already assigned to major ${majorName}`,
          409,
          ClientError.CONFLICT,
        );
      }
    }

    throw new ServerError(
      `Failed to assign major ${majorName} to user ${username}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function removeMajorFromUser(username, majorName) {
  try {
    const row = await pgPool.query(
      `
      DELETE FROM user_majors
      WHERE username = $1 AND major_name = $2
      RETURNING username
      `,
      [username, majorName],
    );

    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `User ${username} is not assigned to major ${majorName}`,
        404,
        ClientError.NOT_FOUND,
      );
    }
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to remove major ${majorName} from user ${username}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchMajorsForUser(username) {
  try {
    const row = await pgPool.query(
      `
        SELECT username
        FROM users
        WHERE username = $1
    `,
      [username],
    );

    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `User ${username} does not exist`,
        404,
        ClientError.NOT_FOUND,
      );
    }

    const rows = await pgPool.query(
      `
      SELECT m.name, m.description
      FROM major m
      JOIN user_majors um ON m.name = um.major_name
      WHERE um.username = $1
      `,
      [username],
    );

    return rows.rows;
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to fetch majors for user ${username}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
