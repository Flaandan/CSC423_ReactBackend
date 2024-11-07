import pg from "pg";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";

export async function addCourseToMajor(
  majorName,
  courseDiscipline,
  courseNumber,
) {
  try {
    await pgPool.query(
      `
      INSERT INTO major_courses (major_name, course_discipline, course_number)
      VALUES ($1, $2, $3)
      `,
      [majorName, courseDiscipline, courseNumber],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "23503") {
        if (err.detail.includes("majorName")) {
          // Foreign key violation due to invalid major name
          throw new ServerError(
            `Major ${majorName} does not exist`,
            404,
            ClientError.NOT_FOUND,
          );
        }
        if (
          err.detail.includes("course_discipline") ||
          err.detail.includes("course_number")
        ) {
          // Foreign key violation due to invalid course
          throw new ServerError(
            `Course ${courseDiscipline} ${courseNumber} does not exist`,
            404,
            ClientError.NOT_FOUND,
          );
        }
      }

      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `Course ${courseDiscipline} ${courseNumber} already added to major ${majorName}`,
          409,
          ClientError.CONFLICT,
        );
      }
    }

    throw new ServerError(
      `Failed to add course ${courseDiscipline} ${courseNumber} to major ${majorName}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function removeCourseFromMajor(
  majorName,
  courseDiscipline,
  courseNumber,
) {
  try {
    const row = await pgPool.query(
      `
      DELETE FROM major_courses
      WHERE major_name = $1 AND course_discipline = $2 AND course_number = $3
      RETURNING major_name
      `,
      [majorName, courseDiscipline, courseNumber],
    );

    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No such course ${courseDiscipline} ${courseNumber} found for major ${majorName}`,
        404,
        ClientError.NOT_FOUND,
      );
    }
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to remove course ${courseDiscipline} ${courseNumber} from major ${majorName}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchCoursesForMajor(majorName) {
  try {
    const row = await pgPool.query(
      `
        SELECT name
        FROM major
        WHERE name = $1
    `,
      [majorName],
    );

    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `Major ${majorName} does not exist`,
        404,
        ClientError.NOT_FOUND,
      );
    }

    const rows = await pgPool.query(
      `
      SELECT c.discipline, c.course_number, c.description, c.max_capacity
      FROM course c
      JOIN major_courses mc ON c.discipline = mc.course_discipline AND c.course_number = mc.course_number
      WHERE mc.major_name = $1
      `,
      [majorName],
    );

    return rows.rows;
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to fetch courses for major ${majorName}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
