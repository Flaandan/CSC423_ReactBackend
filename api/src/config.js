class Config {
  /** @type (string) */
  #nodeEnv;

  /** @type (string) */
  #databaseUser;

  /** @type (string) */
  #databasePassword;

  /** @type (string) */
  #databaseHost;

  /** @type (number) */
  #databasePort;

  /** @type (string) */
  #databaseName;

  /** @type (string) */
  #host;

  /** @type (number) */
  #port;

  constructor() {
    this.#nodeEnv = process.env.NODE_ENV || "development";
    this.#databaseUser = process.env.MARIADB_USER || "user";
    this.#databasePassword = process.env.MARIADB_PASSWORD || "password";
    this.#databaseHost = process.env.MARIADB_HOST || "127.0.0.1";
    this.#databasePort = Number(process.env.MARIADB_PORT) || 3306;
    this.#databaseName = process.env.MARIADB_DATABASE || "react_backend";
    this.#host = process.env.SERVER_HOST || "127.0.0.1";
    this.#port = Number(process.env.SERVER_PORT) || 8000;
  }

  #connectionString() {
    return `mysql://${this.#databaseUser}:${this.#databasePassword}@${this.#databaseHost}:${this.#databasePort}/${this.#databaseName}`;
  }

  static default() {
    const config = new Config();

    return {
      nodeEnv: config.#nodeEnv,
      connectionString: config.#connectionString(),
      server: {
        host: config.#host,
        port: config.#port,
      },
    };
  }
}

export { Config };
