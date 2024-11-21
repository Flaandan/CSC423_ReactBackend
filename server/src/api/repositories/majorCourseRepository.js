import pg from "pg";
import { pgPool } from "../../db.js";
import { ServerError } from "../../error.js";

export async function insertCourseToMajorDB(majorId, courseId) {
  try {
    await pgPool.query(
      `
      INSERT INTO major_courses (major_id, course_id)
      VALUES ($1, $2)
      `,
      [majorId, courseId],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Major or course could not be found",
        );
      }

      if (err.code === "23503") {
        if (err.detail.includes("major_id")) {
          // Foreign key violation due to invalid major
          throw new ServerError(
            `Major with ID ${majorId} does not exist`,
            404,
            "Major could not be found",
          );
        }

        if (err.detail.includes("course_id")) {
          // Foreign key violation due to invalid course
          throw new ServerError(
            `Course with ID ${courseId} does not exist`,
            404,
            "Course could not be found",
          );
        }
      }

      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `Course with ID ${courseId} already added to major with ID ${majorId}`,
          409,
          "The course is already a part of this major",
        );
      }
    }

    throw new ServerError(
      `Failed to add course with ID ${courseId} to major with ID ${majorId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function deleteCourseFromMajorDB(majorId, courseId) {
  try {
    const row = await pgPool.query(
      `
      DELETE FROM major_courses
      WHERE major_id = $1 AND course_id = $2
      RETURNING id
      `,
      [majorId, courseId],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Major or course could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to delete course with ID ${courseId} to major with ID ${majorId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchCoursesForMajorDB(majorId) {
  try {
    const row = await pgPool.query(
      `
        SELECT id
        FROM majors
        WHERE id = $1
    `,
      [majorId],
    );

    if (row.rows.length === 0) return null;

    const rows = await pgPool.query(
      `
      SELECT 
        c.id,
        c.course_discipline, 
        c.course_number, 
        c.description, 
        c.max_capacity, 
        c.current_enrollment,
        c.status, 
        u.first_name AS teacher_first_name,
        u.last_name AS teacher_last_name
      FROM courses c
      JOIN major_courses mc ON c.id = mc.course_id
      JOIN users u ON c.teacher_id = u.id
      WHERE mc.major_id = $1
      `,
      [majorId],
    );

    return rows.rows;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Major could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to fetch courses for major with id ${majorId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}
