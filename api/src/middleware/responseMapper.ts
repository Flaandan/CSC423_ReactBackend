import { ZodError } from "zod";
import { ClientError, ServerError } from "../error.js";
import { HonoServer } from "../server.js";

// Modify responses before they are sent to the client
function responseMapper(server: HonoServer) {
  server.onError(async (err) => {
    if (err instanceof ServerError) {
      const { statusCode, clientError } = err;

      console.error(`ERROR: ${err.message}`);

      return new Response(JSON.stringify({ error: clientError }), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (err instanceof ZodError) {
      console.error(`ERROR: ${err.message}`);

      return new Response(
        JSON.stringify({ error: ClientError.INVALID_PAYLOAD }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Fallback Response
    console.error(`ERROR: ${err.message}`);

    return new Response(JSON.stringify({ error: ClientError.SERVICE_ERROR }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  });
}

export { responseMapper };
