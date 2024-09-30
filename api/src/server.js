import express from "express";
import { healthCheckRoutes } from "./routes/healthCheck.js";

/**
 * @param {{ nodeEnv: string, host: string, port: number, databaseUrl: string }} config
 * @returns {import('express').Express} Express application
 */
export default function build(config) {
  const app = express();

  app.use(express.json());

  app.use("/health-check", healthCheckRoutes(config));

  return app;
}
