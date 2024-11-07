import pg from "pg";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";

export async function registerUserForCourse(
  username,
  courseDiscipline,
  courseNumber,
  semester,
  year,
) {
  try {
    const existingRegistration = await pgPool.query(
      `
      SELECT status
      FROM registration
      WHERE username = $1 
      AND course_discipline = $2
      AND course_number = $3
      AND semester_taken = $4
      AND year_taken = $5
      `,
      [username, courseDiscipline, courseNumber, semester, year],
    );

    // TODO: Changing DROPPED registrations to ENROLLED might be removed
    if (existingRegistration.rows.length > 0) {
      if (existingRegistration.rows[0].status === "DROPPED") {
        await pgPool.query(
          `
          UPDATE registration
          SET status = 'ENROLLED'
          WHERE username = $1 AND course_discipline = $2 AND course_number = $3
          RETURNING id
          `,
          [username, courseDiscipline, courseNumber],
        );
        return;
      }

      throw new ServerError(
        `User ${username} is already registered for ${courseDiscipline} ${courseNumber} in ${semester} ${year}`,
        400,
        ClientError.CONFLICT,
      );
    }

    await pgPool.query(
      `
      INSERT INTO registration (username, course_discipline, course_number, status, semester_taken, year_taken)
      VALUES ($1, $2, $3, 'ENROLLED', $4, $5)
      `,
      [username, courseDiscipline, courseNumber, semester, year],
    );
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

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
    }

    throw new ServerError(
      `Failed to register user ${username} for course ${courseDiscipline} ${courseNumber}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function unregisterUserFromCourse(
  username,
  courseDiscipline,
  courseNumber,
) {
  try {
    const row = await pgPool.query(
      `
      UPDATE registration
      SET status = 'DROPPED'
      WHERE username = $1 AND course_discipline = $2 AND course_number = $3
      RETURNING id
      `,
      [username, courseDiscipline, courseNumber],
    );

    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No registration found for user ${username} in course ${courseDiscipline} ${courseNumber}`,
        404,
        ClientError.NOT_FOUND,
      );
    }
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    if (err instanceof pg.DatabaseError) {
      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `${username} has already dropped the course ${courseDiscipline} ${courseNumber}`,
          409,
          ClientError.CONFLICT,
        );
      }
    }

    throw new ServerError(
      `Failed to unregister user ${username} from course ${courseDiscipline} ${courseNumber}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchRegistrationsForUser(username) {
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
      SELECT r.course_discipline, r.course_number, r.status, r.semester_taken, r.year_taken
      FROM registration r
      WHERE r.username = $1
      `,
      [username],
    );

    return rows.rows;
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to fetch registrations for user ${username}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
