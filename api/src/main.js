import dotenv from "dotenv";
import getConfig from "./config.js";
import build from "./server.js";

const environment = process.env.NODE_ENV || "development";
const filePath = environment === "production" ? ".env.production" : ".env";

// Load .env file based on environment
dotenv.config({ path: filePath });

const config = getConfig();

const app = build(config);

app.listen(config.port, config.host, () => {
  console.log(
    `->> Listening on: ${config.host}:${config.port}\n->> Environment: ${config.nodeEnv}`,
  );
});
