import { pgPool } from "../../db.js";

async function healthCheck(ctx) {
  await pgPool.query("SELECT NOW()");

  const response = {
    status: "available",
  };

  return ctx.json(response);
}

export { healthCheck };
