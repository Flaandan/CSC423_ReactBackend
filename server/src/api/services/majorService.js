import pg from "pg";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";

export async function insertMajor(major) {
  try {
    await pgPool.query(
      `
      INSERT INTO major (name, description)
      VALUES ($1, $2)
      `,
      [major.name, major.description],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      // Duplicate key violation
      if (err.code === "23505") {
        throw new ServerError(
          `Major with name '${major.name}' already exists.`,
          409,
          ClientError.CONFLICT,
        );
      }
    }

    throw new ServerError(
      `Failed to insert major '${major.name}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function updateMajor(major) {
  try {
    const row = await pgPool.query(
      `
      UPDATE major
      SET description = $1
      WHERE name = $2
      RETURNING name
      `,
      [major.description, major.name],
    );

    // Null if major not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No major found with name: ${major.name}`,
        404,
        ClientError.NOT_FOUND,
      );
    }
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to update major '${major.name}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function deleteMajor(majorName) {
  try {
    const row = await pgPool.query(
      `
      DELETE FROM major
      WHERE name = $1
      RETURNING name
      `,
      [majorName],
    );

    // Null if major not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No major found with name: ${majorName}`,
        404,
        ClientError.NOT_FOUND,
      );
    }
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to delete major '${majorName}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchMajorByName(majorName) {
  try {
    const row = await pgPool.query(
      `
      SELECT name, description
      FROM major
      WHERE name = $1
      `,
      [majorName],
    );

    // Null if major not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record) {
      throw new ServerError(
        `No major found with name: ${majorName}`,
        404,
        ClientError.NOT_FOUND,
      );
    }

    return record;
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to fetch major '${majorName}': ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchAllMajors() {
  try {
    const rows = await pgPool.query(
      `
      SELECT name, description
      FROM major
      `,
    );

    return rows.rows;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch all majors: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
