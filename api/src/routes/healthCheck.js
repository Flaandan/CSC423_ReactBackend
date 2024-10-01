import express from "express";

const router = express.Router();

/**
 * @async
 * @param {import('../lib/types.ts').Config} config
 * @param {import('mysql2/promise').Pool} pool
 * @returns {Promise<import('express').Router>}
 */
export async function healthCheck(config, pool) {
  const connection = await pool.getConnection();

  try {
    const [results, fields] = await connection.query("SELECT * FROM `users`");

    console.info(results);
    console.info(fields);
  } catch (err) {
    console.info(err);
  }

  router.get("/", (_, response) => {
    const responseBody = {
      status: "available",
      environment: `${config.nodeEnv}`,
      database_connection: connection ? "connected" : "error",
    };

    response.setHeader("Content-Type", "application/json");
    response.removeHeader("X-Powered-By");
    response.status(200).json(responseBody);
  });

  return router;
}
