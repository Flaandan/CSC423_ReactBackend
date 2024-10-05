import { Context } from "hono";
import { pgPool } from "../db.js";

async function healthCheck(ctx: Context) {
  try {
    await pgPool.query("SELECT NOW()");

    const response = {
      status: "available",
      environment: process.env.NODE_ENV,
      total_pool_connections: pgPool.totalCount,
      idle_pool_connections: pgPool.idleCount,
      time: new Date().toLocaleString(),
    };

    return ctx.json(response, 200);
  } catch (error: unknown) {
    let errorMessage: string;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }

    const response = {
      status: "error",
      message: errorMessage,
      environment: process.env.NODE_ENV,
      total_pool_connections: pgPool.totalCount,
      idle_pool_connections: pgPool.idleCount,
      time: new Date().toLocaleString(),
    };

    return ctx.json(response, 500);
  }
}

export { healthCheck };
