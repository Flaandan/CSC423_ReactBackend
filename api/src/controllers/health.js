import { pgPool } from "../db.js";

async function healthCheck(ctx) {
  try {
    await pgPool.query("SELECT version()");

    const response = {
      status: "available",
      environment: process.env.NODE_ENV,
      total_pool_connections: pgPool.totalCount,
      idle_pool_connections: pgPool.idleCount,
      time: new Date().toLocaleString(),
    };

    return ctx.json(response, 200);
  } catch (err) {
    const response = {
      status: "error",
      message: err,
      environment: process.env.NODE_ENV,
      total_pool_connections: pgPool.totalCount,
      idle_pool_connections: pgPool.idleCount,
      time: new Date().toLocaleString(),
    };

    return ctx.json(response, 500);
  }
}

export { healthCheck };
