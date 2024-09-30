import express from "express";

const router = express.Router();

export function healthCheckRoutes(config) {
  router.get("/", (request, response) => {
    const responseBody = {
      status: "available",
      environment: `${config.nodeEnv}`,
    };

    response.json(responseBody);
  });

  return router;
}
