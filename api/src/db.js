import pg from "pg";
import { config } from "./config.js";

class PGPool extends pg.Pool {
  constructor() {
    const poolConfig = {
      host: config.pgHost,
      database: config.pgDatabase,
      username: config.pgUser,
      password: config.pgPassword,
      port: 5432,
    };

    if (process.env.NODE_ENV === "production") {
      poolConfig.ssl = {
        require: true,
      };
    }

    super(poolConfig);
  }
}

const pgPool = new PGPool();

export { pgPool };
