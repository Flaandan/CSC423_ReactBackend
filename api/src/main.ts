import { config } from "./config.js";
import { Application } from "./server.js";

function main() {
  const application = Application.build(config);

  console.info(
    `->>\t Listening on: ${application.host}:${application.port}\n->>\t Environment: ${process.env.NODE_ENV}`,
  );

  application.runServer();
}

main();
