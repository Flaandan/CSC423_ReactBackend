import pg from "pg";
import { pgPool } from "../../db.js";
import { ClientError, ServerError } from "../../error.js";
import { User } from "../models/user.js";
import { formatDate } from "../utils/formatDate.js";
import { computePasswordHash, validateCredentials } from "./authService.js";

export async function updateUserLastLogin(username) {
  try {
    const row = await pgPool.query(
      `
        UPDATE users
        SET last_login = NOW()
        WHERE username = $1
        RETURNING last_login  
      `,
      [username],
    );

    // Null if last_login not returned
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record)
      throw new ServerError(
        `No user found with the username: ${username ?? ""}`,
        404,
        ClientError.NOT_FOUND,
      );

    return record.last_login;
  } catch (err) {
    throw new ServerError(
      `Failed to update last login timestamp for user ${username ?? ""}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function changeUserPassword(payload) {
  const credentials = {
    username: payload.username,
    password: payload.current_password,
  };

  // Throw away return value
  await validateCredentials(credentials);

  const passwordHash = await computePasswordHash(payload.new_password);

  try {
    await pgPool.query(
      `
        UPDATE users 
        SET password_hash = $1 
        WHERE username = $2
        `,
      [passwordHash, payload.username],
    );
  } catch (err) {
    throw new ServerError(
      `Failed to update users password in database: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchUserByUsername(username) {
  try {
    const row = await pgPool.query(
      `
        SELECT username, first_name, last_name, password_hash, role, phone_number, office, last_login
        FROM users
        WHERE username = $1
      `,
      [username],
    );

    // Null if user not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record)
      throw new ServerError(
        `No user found with the username: ${username ?? ""}`,
        404,
        ClientError.NOT_FOUND,
      );

    const user = new User.builder()
      .setUsername(record.username)
      .setFirstName(record.first_name)
      .setLastName(record.last_name)
      .setPasswordHash(record.password_hash)
      .setRole(record.role)
      .setPhoneNumber(record.phone_number)
      .setOffice(record.office)
      .setLastLogin(formatDate(record.last_login))
      .build();

    return user.toUserDTO();
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to fetch details for user ${username ?? ""} : ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function fetchAllUsers() {
  try {
    const rows = await pgPool.query(
      `
            SELECT username, first_name, last_name, role, phone_number, office, last_login
            FROM users
            `,
    );

    const users = rows.rows;

    const userDTOs = users.map((userData) => {
      const user = new User.builder()
        .setUsername(userData.username)
        .setFirstName(userData.first_name)
        .setLastName(userData.last_name)
        .setRole(userData.role)
        .setPhoneNumber(userData.phone_number)
        .setOffice(userData.office)
        .setLastLogin(formatDate(userData.last_login))
        .build();

      return user.toUserDTO();
    });

    return userDTOs;
  } catch (err) {
    throw new ServerError(
      `Failed to fetch all users from database : ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function insertUser(user) {
  try {
    const row = await pgPool.query(
      `
     INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     `,
      [
        user.username,
        user.firstName,
        user.lastName,
        user.passwordHash,
        user.role,
        user.phoneNumber,
        user.office,
      ],
    );
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      // Duplicate key violation
      if (err.code === "23505") {
        throw new ServerError(
          `Username is already in use: ${String(err)}`,
          409,
          ClientError.CONFLICT,
        );
      }
    }

    throw new ServerError(
      `Failed to insert user ${user.username ?? ""}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function updateUser(user) {
  try {
    const row = await pgPool.query(
      `
         UPDATE users
         SET first_name = $1, last_name = $2, role = $3, phone_number = $4, office = $5
         WHERE username = $6
         RETURNING username
         `,
      [
        user.firstName,
        user.lastName,
        user.role,
        user.phoneNumber,
        user.office,
        user.username,
      ],
    );

    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record)
      throw new ServerError(
        `No user found with the username: ${username ?? ""}`,
        404,
        ClientError.NOT_FOUND,
      );
  } catch (err) {
    throw new ServerError(
      `Failed to update user ${user.username ?? ""}: ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}

export async function deleteUser(username) {
  try {
    const row = await pgPool.query(
      `
        DELETE FROM users
        WHERE username = $1
        RETURNING username
      `,
      [username],
    );

    // Null if user not found
    const record = row.rows.length > 0 ? row.rows[0] : null;

    if (!record)
      throw new ServerError(
        `No user found with the username: ${username ?? ""}`,
        404,
        ClientError.NOT_FOUND,
      );
  } catch (err) {
    if (err instanceof ServerError) {
      throw err;
    }

    throw new ServerError(
      `Failed to delete user ${username ?? ""} : ${String(err)}`,
      500,
      ClientError.SERVICE_ERROR,
    );
  }
}
