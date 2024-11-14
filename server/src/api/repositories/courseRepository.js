import pg from "pg";
import { pgPool } from "../../db.js";
import { ServerError } from "../../error.js";
import { insertCourseToMajorDB } from "./majorCourseRepository.js";

export async function insertCourseDB(course, majorId) {
  try {
    const existingMajor = await pgPool.query(
      `
      SELECT id
      FROM majors
      WHERE id = $1
      `,
      [majorId],
    );

    if (existingMajor.rows.length === 0) {
      throw new ServerError(
        `Major with ID ${majorId} does not exist`,
        404,
        "Major could not be found",
      );
    }

    const row = await pgPool.query(
      `
      INSERT INTO courses (teacher_id, course_discipline, course_number, description, max_capacity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        course.teacher_id,
        course.course_discipline,
        course.course_number,
        course.description,
        course.max_capacity,
      ],
    );

    const courseId = row.rows[0].id;

    await insertCourseToMajorDB(majorId, courseId);
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Teacher could not be found",
        );
      }

      if (err.code === "23503") {
        // Foreign key violation due to invalid teacher_id
        throw new ServerError(
          `Teacher with ID ${course.teacher_id} could not be found`,
          404,
          "Teacher could not be found",
        );
      }

      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `Course '${course.course_discipline} ${course.course_number}' already exists`,
          409,
          "Course already exists",
        );
      }
    }

    throw new ServerError(
      `Failed to insert course '${course.course_discipline} ${course.course_number}': ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function updateCourseDB(course) {
  try {
    const row = await pgPool.query(
      `
      UPDATE courses
      SET 
        teacher_id = $1, 
        course_discipline = $2,
        course_number = $3,
        description = $4, 
        max_capacity = $5, 
        status = $6
      WHERE id = $7
      RETURNING id
      `,
      [
        course.teacher_id,
        course.course_discipline,
        course.course_number,
        course.description,
        course.max_capacity,
        course.status,
        course.id,
      ],
    );

    // Null if course not found
    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Teacher or course could not be found",
        );
      }

      if (err.code === "23503") {
        // Foreign key violation due to invalid teacher_id
        throw new ServerError(
          `Teacher with ID ${course.teacher_id} could not be found`,
          404,
          "Teacher could not be found",
        );
      }

      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `Course '${course.course_discipline} ${course.course_number}' already exists`,
          409,
          "Course already exists",
        );
      }
    }

    throw new ServerError(
      `Failed to update course '${course.course_discipline} ${course.course_number}': ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function softDeleteCourseDB(id) {
  try {
    const row = await pgPool.query(
      `
      UPDATE courses
      SET status = 'INACTIVE', current_enrollment = 0
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );

    if (row.rows.length === 0) return null;

    const rows = await pgPool.query(
      `
      DELETE FROM registrations
      WHERE course_id = $1
      `,
      [id],
    );

    // TODO: Remove from table or change status for students when soft deleting course?
    //    const rows = await pgPool.query(
    //      `
    //      UPDATE registrations
    //      SET status = 'UNENROLLED'
    //      WHERE course_id = $1
    //      `,
    //      [id],
    //    );

    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invalid UUID provided: ${String(err)}`,
          404,
          "Course could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to soft delete course with id ${id}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchCourseByIdDB(id) {
  try {
    const row = await pgPool.query(
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
      FROM 
        courses c
      JOIN 
        users u ON c.teacher_id = u.id
      WHERE 
        c.id = $1
      `,
      [id],
    );

    // Null if course not found
    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invaild UUID provided: ${String(err)}`,
          404,
          "Course could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to fetch course with ID '${id}': ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchAllCoursesDB() {
  try {
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
      FROM 
        courses c
      JOIN 
        users u ON c.teacher_id = u.id
      `,
    );

    return rows.rows;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch all courses: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchUsersInCourseByIdDB(id) {
  try {
    const rows = await pgPool.query(
      `
      SELECT 
        u.username, 
        u.first_name, 
        u.last_name,
        r.status
      FROM 
        users u
      JOIN 
        registrations r ON u.id = r.student_id
      WHERE 
        r.course_id = $1
      `,
      [id],
    );

    return rows.rows;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invalid UUID provided: ${String(err)}`,
          404,
          "Course could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to fetch users in course with ID ${id}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchCoursesByTeacherIdDB(teacherId) {
  try {
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
      FROM 
        courses c
      JOIN 
        users u ON c.teacher_id = u.id
      WHERE 
        c.teacher_id = $1
      `,
      [teacherId],
    );

    return rows.rows.length > 0 ? rows.rows : null;
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "22P02") {
        // Syntax error (invalid UUID)
        throw new ServerError(
          `Invalid UUID provided: ${String(err)}`,
          404,
          "Courses could not be found",
        );
      }
    }

    throw new ServerError(
      `Failed to fetch courses for teacher ID '${teacherId}': ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}
