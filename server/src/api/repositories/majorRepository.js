import pg from "pg";
import { pgPool } from "../../db.js";
import { ServerError } from "../../error.js";

export async function insertMajorDB(major) {
  try {
    await pgPool.query(
      `
      INSERT INTO majors (name, description)
      VALUES ($1, $2)
      `,
      [major.name, major.description],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      // Duplicate key violation
      if (err.code === "23505") {
        throw new ServerError(
          `Major with name '${major.name}' already exists`,
          409,
          "Major already exists",
        );
      }
    }

    throw new ServerError(
      `Failed to insert major '${major.name}': ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function updateMajorDB(major) {
  try {
    const row = await pgPool.query(
      `
      UPDATE majors
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING name
      `,
      [major.name, major.description, major.id],
    );

    // Null if major not found
    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to update major '${major.name}': ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function deleteMajorDB(majorId) {
  try {
    const row = await pgPool.query(
      `
      DELETE FROM majors
      WHERE id = $1
      RETURNING id
      `,
      [majorId],
    );

    // Null if major not found
    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to delete major with ID ${majorId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchMajorByIdDB(majorId) {
  try {
    const row = await pgPool.query(
      `
      SELECT id, name, description
      FROM majors
      WHERE id = $1
      `,
      [majorId],
    );

    // Null if major not found
    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to fetch major with ID ${majorId}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchAllMajorsDB() {
  try {
    const rows = await pgPool.query(
      `
      SELECT id, name, description
      FROM majors
      `,
    );

    return rows.rows;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch all majors: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}
