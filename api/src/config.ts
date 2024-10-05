import dotenv from "dotenv";

class Config {
  #pgHost: string;

  #pgDatabase: string;

  #pgUser: string;

  #pgPassword: string;

  #serverHost: string;

  #serverPort: number;

  constructor() {
    // Detect the running environment
    const environment = process.env.NODE_ENV;

    const filePath = environment === "production" ? ".env.production" : ".env";

    // Load the specified .env file
    dotenv.config({ path: filePath });

    if (!process.env.PGHOST) throw new Error("PGHOST not defined");
    if (!process.env.PGDATABASE) throw new Error("PGDATABASE not defined");
    if (!process.env.PGUSER) throw new Error("PGUSER not defined");
    if (!process.env.PGPASSWORD) throw new Error("PGPASSWORD not defined");
    if (!process.env.SERVER_HOST) throw new Error("SERVER_HOST not defined");
    if (!process.env.SERVER_PORT) throw new Error("SERVER_PORT not defined");

    this.#pgHost = process.env.PGHOST;
    this.#pgDatabase = process.env.PGDATABASE;
    this.#pgUser = process.env.PGUSER;
    this.#pgPassword = process.env.PGPASSWORD;
    this.#serverHost = process.env.SERVER_HOST;
    this.#serverPort = Number(process.env.SERVER_PORT);
  }

  connectionString(environment: string | undefined): string {
    return `postgres://${this.#pgUser}:${this.#pgPassword}@${this.#pgHost}:5432/${this.#pgDatabase}${environment === "production" ? "?sslmode=require" : ""}`;
  }

  get serverHost(): string {
    return this.#serverHost;
  }

  get serverPort(): number {
    return this.#serverPort;
  }
}

const config = new Config();

export { config };
