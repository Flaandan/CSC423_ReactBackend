import pg from "pg";
import { pgPool } from "../../db.js";
import { ServerError } from "../../error.js";

export async function insertRegistrationForUserDB(
  studentId,
  courseId,
  semesterTaken,
  yearTaken,
) {
  try {
    const userMajor = await pgPool.query(
      `
      SELECT major_id
      FROM user_majors
      WHERE student_id = $1
      `,
      [studentId],
    );

    if (userMajor.rows.length === 0) {
      throw new ServerError(
        `Student with ID ${studentId} does not have an assigned major`,
        400,
        "You must have a major before registering",
      );
    }

    const studentMajorId = userMajor.rows[0].major_id;

    const isCourseInMajor = await pgPool.query(
      `
      SELECT 1
      FROM major_courses
      WHERE major_id = $1 AND course_id = $2
      `,
      [studentMajorId, courseId],
    );

    if (isCourseInMajor.rows.length === 0) {
      throw new ServerError(
        `Course with ID ${courseId} is not part of the student's major with ID ${studentId}`,
        400,
        "Course you are registering for is not part of the major",
      );
    }

    const courseDetails = await pgPool.query(
      `
      SELECT current_enrollment, max_capacity, status
      FROM courses
      WHERE id = $1
      `,
      [courseId],
    );

    if (courseDetails.rows.length === 0) {
      throw new ServerError(
        `Course with ID ${courseId} does not exist`,
        404,
        "Course could not be found",
      );
    }

    const {
      current_enrollment,
      max_capacity,
      status: courseStatus,
    } = courseDetails.rows[0];

    // Check if the course status is INACTIVE
    if (courseStatus === "INACTIVE") {
      throw new ServerError(
        `Student ${studentId} could not register. Course with ID ${courseId} is inactive`,
        400,
        "Course is inactive",
      );
    }

    // Check if the course has reached its maximum capacity
    if (current_enrollment >= max_capacity) {
      throw new ServerError(
        `Student ${studentId} could not register. Course with ID ${courseId} has reached its maximum capacity`,
        400,
        "Course has reached the maximum capacity",
      );
    }

    const existingRegistration = await pgPool.query(
      `
      SELECT status
      FROM registrations
      WHERE student_id = $1 
      AND course_id = $2
      AND semester_taken = $3
      AND year_taken = $4
      `,
      [studentId, courseId, semesterTaken, yearTaken],
    );

    if (existingRegistration.rows.length > 0) {
      const status = existingRegistration.rows[0].status;

      if (status === "UNENROLLED") {
        await pgPool.query(
          `
          UPDATE registrations
          SET semester_taken = $1, year_taken = $2, status = 'ENROLLED'
          WHERE student_id = $3 AND course_id = $4
          RETURNING id
          `,
          [semesterTaken, yearTaken, studentId, courseId],
        );
        return; // Return early after successful update. Returns undefined
      }

      // Return null when user is already registered for course and previous status was not 'UNENROLLED'
      return null;
    }

    const row = await pgPool.query(
      `
      INSERT INTO registrations (student_id, course_id, semester_taken, year_taken)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [studentId, courseId, semesterTaken, yearTaken],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invalid UUID provided: ${String(err)}`,
          404,
          "Student or course could not be found",
        );
      }

      if (err.code === "23503") {
        // Foreign key violation (invalid student or course id)
        if (err.detail.includes("student_id")) {
          throw new ServerError(
            `Student with ID ${studentId} does not exist`,
            404,
            "Student could not be found",
          );
        }

        if (err.detail.includes("course_id")) {
          throw new ServerError(
            `Course with ID ${courseId} does not exist`,
            404,
            "Course could not be found",
          );
        }
      }
    }

    throw new ServerError(
      `Failed to register user with ID ${studentId} for course with ID ${courseId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function updateRegistrationStatusForUserDB(studentId, courseId) {
  try {
    const row = await pgPool.query(
      `
      UPDATE registrations
      SET status = 'UNENROLLED'
      WHERE student_id = $1 AND course_id = $2
      RETURNING id
      `,
      [studentId, courseId],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Student or course could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to unregister user with ID ${studentId} from course with ID ${courseId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchRegistrationsForUserDB(studentId) {
  try {
    const row = await pgPool.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      `,
      [studentId],
    );

    if (row.rows.length === 0) return null;

    const rows = await pgPool.query(
      `
      SELECT 
        c.course_discipline, 
        c.course_number, 
        c.description, 
        r.status, 
        r.semester_taken, 
        r.year_taken, 
        u.first_name AS teacher_first_name, 
        u.last_name AS teacher_last_name
      FROM registrations r
      JOIN courses c ON r.course_id = c.id
      JOIN users u ON c.teacher_id = u.id
      WHERE r.student_id = $1 AND r.status = 'ENROLLED'
      `,
      [studentId],
    );

    return rows.rows;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Student could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to fetch registrations for user with ID ${studentId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}
