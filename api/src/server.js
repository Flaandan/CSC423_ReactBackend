import express from "express";
import { healthCheckRoutes as healthCheck } from "./routes/healthCheck.js";

export default function build(config) {
  const app = express();

  // Middleware
  app.use(express.json());

  app.use("/health-check", healthCheck(config));

  return app;
}
