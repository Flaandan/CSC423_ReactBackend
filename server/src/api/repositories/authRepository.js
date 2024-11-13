import { pgPool } from "../../db.js";
import { ServerError } from "../../error.js";

export async function fetchUserCredentialsDB(username) {
  try {
    const row = await pgPool.query(
      `
        SELECT id, username, password_hash
        FROM users
        WHERE username = $1
      `,
      [username],
    );

    return row.rows.length > 0 ? row.rows[0] : null;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch credentials for user ${username} : ${String(err)}`,
      500,
      "SERVICE_ERROR",
    );
  }
}
