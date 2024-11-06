import pg from "pg";
import { config } from "./config.js";

class PGPool extends pg.Pool {
  constructor() {
    super({
      connectionString: config.connectionString(process.env.NODE_ENV),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
}

export const pgPool = new PGPool();
