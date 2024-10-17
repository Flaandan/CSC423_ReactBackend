import fs from "node:fs";
import path from "node:path";
import toml from "toml";

class Config {
  #pgHost;

  #pgDatabase;

  #pgUser;

  #pgPassword;

  #serverHost;

  #serverPort;

  #jwtSecret;

  constructor() {
    // Detect the running environment
    const environment = process.env.NODE_ENV;

    const filePath =
      environment === "production"
        ? "config/production.toml"
        : "config/local.toml";

    const configPath = path.join(process.cwd(), filePath);

    // Load the specified TOML file
    const config = toml.parse(fs.readFileSync(configPath, "utf-8"));

    if (!config.database.PGHOST) throw new Error("PGHOST not defined");
    if (!config.database.PGDATABASE) throw new Error("PGDATABASE not defined");
    if (!config.database.PGUSER) throw new Error("PGUSER not defined");
    if (!config.database.PGPASSWORD) throw new Error("PGPASSWORD not defined");
    if (!config.server.SERVER_HOST) throw new Error("SERVER_HOST not defined");
    if (!config.server.SERVER_PORT) throw new Error("SERVER_PORT not defined");
    if (!config.server.JWT_SECRET) throw new Error("JWT_SECRET not defined");

    this.#pgHost = config.database.PGHOST;
    this.#pgDatabase = config.database.PGDATABASE;
    this.#pgUser = config.database.PGUSER;
    this.#pgPassword = config.database.PGPASSWORD;
    this.#serverHost = config.server.SERVER_HOST;
    this.#serverPort = Number(config.server.SERVER_PORT);
    this.#jwtSecret = config.server.JWT_SECRET;
  }

  connectionString(environment) {
    return `postgres://${this.#pgUser}:${this.#pgPassword}@${this.#pgHost}:5432/${this.#pgDatabase}${environment === "production" ? "?sslmode=require" : ""}`;
  }

  get serverHost() {
    return this.#serverHost;
  }

  get serverPort() {
    return this.#serverPort;
  }

  get jwtSecret() {
    return this.#jwtSecret;
  }
}

const config = new Config();

export { config };
