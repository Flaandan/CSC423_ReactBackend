import express from "express";

const router = express.Router();

/**
 * Builds an Express application.
 *
 * @param {{ nodeEnv: string, host: string, port: number, databaseUrl: string }} config - The configuration object for the application
 * @returns {import('express').Router} Express application
 */
export function healthCheckRoutes(config) {
  router.get("/", (_, response) => {
    const responseBody = {
      status: "available",
      environment: `${config.nodeEnv}`,
    };

    response.setHeader("Content-Type", "text/plain");
    response.removeHeader("X-Powered-By");
    response.status(200).json(responseBody);
  });

  return router;
}
