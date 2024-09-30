import dotenv from "dotenv";
import getConfig from "./config.js";
import build from "./server.js";

function main() {
  // Detect the running environment. Defaults to `development` if not provided
  const environment = process.env.NODE_ENV;
  const filePath = environment === "production" ? ".env.production" : ".env";

  // Load the specified .env file
  dotenv.config({ path: filePath });

  const config = getConfig();

  const app = build(config);

  app.listen(config.port, config.host, () => {
    console.log(
      `->> Listening on: ${config.host}:${config.port}\n->> Environment: ${config.nodeEnv}`,
    );
  });
}

main();
