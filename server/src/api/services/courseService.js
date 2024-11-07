import pg from "pg";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";
import { formatDate } from "../utils/formatDate.js";

export async function insertCourse(course) {
  try {
    await pgPool.query(
      `
      INSERT INTO course (discipline, course_number, description, max_capacity)
      VALUES ($1, $2, $3, $4)
      `,
      [
        course.discipline,
        course.courseNumber,
        course.description,
        course.maxCapacity,
      ],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      // Duplicate key violation
      if (err.code === "23505") {
        throw new ServerError(
          `Course '${course.discipline} ${course.courseNumber}' already exists`,
          409,
          ClientError.CONFLICT,
        );
      }
    }

    throw new ServerError(
      `Failed to insert course '${course.discipline} ${course.courseNumber}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function updateCourse(course) {
  // `course` is being fetched from the function `fetchCourseByDisciplineAndNumber`
  try {
    const row = await pgPool.query(
      `
      UPDATE course
      SET description = $1, max_capacity = $2, last_updated = NOW()
      WHERE discipline = $3 AND course_number = $4
      RETURNING discipline, course_number
      `,
      [
        course.description,
        course.max_capacity,
        course.discipline,
        course.course_number,
      ],
    );

    // Null if course not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No course found with discipline: '${course.discipline}' and course number: ${course.course_number}`,
        404,
        ClientError.NOT_FOUND,
      );
    }
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to update course '${course.discipline} ${course.course_number}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function deleteCourse(discipline, courseNumber) {
  try {
    const row = await pgPool.query(
      `
      DELETE FROM course
      WHERE discipline = $1 AND course_number = $2
      RETURNING discipline, course_number
      `,
      [discipline, courseNumber],
    );

    // Null if course not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No course found with discipline: '${discipline}' and course number: ${courseNumber}`,
        404,
        ClientError.NOT_FOUND,
      );
    }
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to delete course '${discipline} ${courseNumber}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchCourseByDisciplineAndNumber(
  discipline,
  courseNumber,
) {
  try {
    const row = await pgPool.query(
      `
      SELECT discipline, course_number, description, max_capacity, last_updated
      FROM course
      WHERE discipline = $1 AND course_number = $2
      `,
      [discipline, courseNumber],
    );

    // Null if course not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No course found with discipline: '${discipline}' and course number: ${courseNumber}`,
        404,
        ClientError.NOT_FOUND,
      );
    }

    record.last_updated = formatDate(record.last_updated);

    return record;
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to fetch course '${discipline} ${courseNumber}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchAllCourses() {
  try {
    const rows = await pgPool.query(
      `
      SELECT discipline, course_number, description, max_capacity, last_updated
      FROM course
      `,
    );

    const mutatedRows = rows.rows.map((course) => {
      course.last_updated = formatDate(course.last_updated);

      return course;
    });

    return mutatedRows;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch all courses: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
