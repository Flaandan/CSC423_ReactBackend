import dotenv from "dotenv";
import { Config } from "./config.js";
import { Application } from "./server.js";

async function main() {
  // Detect the running environment. Defaults to `development` if not provided
  const environment = process.env.NODE_ENV;

  const filePath = environment === "production" ? ".env.production" : ".env";

  // Load the specified .env file
  dotenv.config({ path: filePath });

  const config = Config.default();

  const application = await Application.build(config);

  console.info(
    `->>\t Listening on: ${config.server.host}:${config.server.port}\n->>\t Environment: ${config.nodeEnv}`,
  );

  await application.runServer();
}

await main();
