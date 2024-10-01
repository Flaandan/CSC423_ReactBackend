import express from "express";
import { healthCheck } from "./routes/healthCheck.js";
import mysql from "mysql2/promise";

class Application {
  /** @type (number) */
  #port;

  /** @type (string) */
  #host;

  /** @type {import('express').Express} */
  #server;

  /**
   * @param {number} port
   * @param {string} host
   * @param {import('express').Express} server
   * */
  constructor(port, host, server) {
    this.#port = port;
    this.#host = host;
    this.#server = server;
  }

  /**
   * @param {import('./lib/types').Config} config
   * @returns Application
   * */
  static async build(config) {
    const pool = getDbPool(config);

    const host = config.server.host;
    const port = config.server.port;

    const server = await serve(pool, config);

    return new Application(port, host, server);
  }

  getPort() {
    return this.#port;
  }

  getHost() {
    return this.#host;
  }

  async runServer() {
    await this.#server.listen(this.#port, this.#host);
  }
}

/**
 * @param {import('./lib/types').Config} config
 * @returns {import('mysql2/promise').Pool}
 */
function getDbPool(config) {
  const pool = mysql.createPool({
    uri: config.connectionString,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return pool;
}

/**
 * @async
 * @param {import('./lib/types').Config} config
 * @param {import('mysql2/promise').Pool} pool
 * @returns {Promise<import('express').Express>}
 * */
async function serve(pool, config) {
  const server = express();

  server.use(express.json());

  server.use("/health-check", await healthCheck(config, pool));

  return server;
}

export { Application };
