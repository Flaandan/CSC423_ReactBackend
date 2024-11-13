import pg from "pg";
import { pgPool } from "../../db.js";
import { ServerError } from "../../error.js";

export async function insertMajorToUserDB(userId, majorId) {
  try {
    await pgPool.query(
      `
      INSERT INTO user_majors (student_id, major_id)
      VALUES ($1, $2)
      `,
      [userId, majorId],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "User or major could not be found",
        );
      }

      if (err.code === "23503") {
        if (err.detail.includes("student_id")) {
          // Foreign key violation due to invalid user
          throw new ServerError(
            `User with ID ${userId} does not exist`,
            404,
            "User does not exist",
          );
        }

        if (err.detail.includes("major_id")) {
          // Foreign key violation due to invalid major
          throw new ServerError(
            `Major with ID ${majorId} does not exist`,
            404,
            "Major does not exist",
          );
        }
      }

      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `User with ID ${userId} is already assigned to major with ID ${majorId}`,
          409,
          "User is already assigned to this major",
        );
      }
    }

    throw new ServerError(
      `Failed to assign major with ID ${majorId} to user with ID ${userId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function deleteMajorFromUserDB(userId, majorId) {
  try {
    const row = await pgPool.query(
      `
      DELETE FROM user_majors
      WHERE student_id = $1 AND major_id = $2
      RETURNING id
      `,
      [userId, majorId],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "User or major could not be found",
        );
      }

      if (err.code === "23503") {
        if (err.detail.includes("student_id")) {
          // Foreign key violation due to invalid user
          throw new ServerError(
            `User with ID ${userId} does not exist`,
            404,
            "User does not exist",
          );
        }

        if (err.detail.includes("major_id")) {
          // Foreign key violation due to invalid major
          throw new ServerError(
            `Major with ID ${majorId} does not exist`,
            404,
            "Major does not exist",
          );
        }
      }
    }

    throw new ServerError(
      `Failed to remove major with ID ${majorId} from user with ID ${userId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchMajorsForUserDB(userId) {
  try {
    const row = await pgPool.query(
      `
        SELECT id
        FROM users
        WHERE id = $1
    `,
      [userId],
    );

    if (row.rows.length === 0) return null;

    const rows = await pgPool.query(
      `
      SELECT m.id, m.name, m.description
      FROM majors m
      JOIN user_majors um ON m.id = um.major_id
      WHERE um.student_id = $1
      `,
      [userId],
    );

    return rows.rows;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "User could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to fetch majors for user with ID ${userId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}
