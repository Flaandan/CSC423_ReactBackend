import { pgPool } from "../../db.js";

export async function apiHealthCheck(ctx) {
  await pgPool.query("SELECT NOW()");

  const response = {
    status: "available",
  };

  return ctx.json(response);
}
