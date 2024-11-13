import pg from "pg";
import { pgPool } from "../../db.js";
import { ServerError } from "../../error.js";

// export async function fetchUserRoleByIdDB(id) {
//   try {
//     const row = await pgPool.query(
//       `
//         SELECT role
//         FROM users
//         WHERE id = $1
//       `,
//       [id],
//     );
//
//     return row.rows.length > 0 ? row.rows[0] : null;
//   } catch (err) {
//     if (err instanceof pg.DatabaseError) {
//       if (err.code === "22P02") {
//         // Syntax error (invalid UUID)
//         throw new ServerError(
//           `Invaild UUID provided: ${String(err)}`,
//           404,
//           "User could not be found",
//         );
//       }
//     }
//
//     throw new ServerError(
//       `Failed to fetch role for user with ID ${id}: ${String(err)}`,
//       500,
//       "SERVICE_ERROR",
//     );
//   }
// }

export async function updateUserLastLoginDB(id) {
  try {
    const row = await pgPool.query(
      `
        UPDATE users
        SET last_login = NOW()
        WHERE id = $1
        RETURNING last_login  
      `,
      [id],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to update last login timestamp for user with ID ${id}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchUserByIdDB(id) {
  try {
    const row = await pgPool.query(
      `
        SELECT id, username, first_name, last_name, password_hash, role, phone_number, office, last_login
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to fetch details for user with ID ${id}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function fetchAllUsersDB() {
  try {
    const rows = await pgPool.query(
      `
        SELECT id, first_name, last_name, username, role, phone_number, office, last_login
        FROM users
      `,
    );

    return rows.rows;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch all users from database: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function insertUserDB(user) {
  try {
    await pgPool.query(
      `
        INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        user.username,
        user.first_name,
        user.last_name,
        user.password_hash,
        user.role,
        user.phone_number,
        user.office,
      ],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === "23505") {
        // Duplicate key violation
        throw new ServerError(
          `Username is already in use: ${String(err)}`,
          409,
          "This username is alredy in use",
        );
      }
    }

    throw new ServerError(
      `Failed to insert user ${user.username}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function updateUserDB(user) {
  try {
    const row = await pgPool.query(
      `
        UPDATE users
        SET first_name = $1, last_name = $2, role = $3, phone_number = $4, office = $5
        WHERE id = $6
        RETURNING id
      `,
      [
        user.first_name,
        user.last_name,
        user.role,
        user.phone_number,
        user.office,
        user.id,
      ],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to update user ${user.username}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function deleteUserDB(id) {
  try {
    const row = await pgPool.query(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING id
      `,
      [id],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to delete user with ID ${id}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}

export async function updateUserPasswordDB(id, passwordHash) {
  try {
    const row = await pgPool.query(
      `
        UPDATE users
        SET password_hash = $1
        WHERE id = $2
        RETURNING id
      `,
      [passwordHash, id],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
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
      `Failed to update password for user with ID ${id}: ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}
