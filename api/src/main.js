import { config } from "./config.js";
import { Application } from "./server.js";

function main() {
  const application = Application.build(config);

  console.table([
    {
      Listening: `${application.host}:${application.port}`,
      Environment: process.env.NODE_ENV,
    },
  ]);

  application.runServer();
}

main();
