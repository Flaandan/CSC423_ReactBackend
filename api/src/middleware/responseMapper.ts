import { Hono } from "hono";
import { ZodError } from "zod";
import { ClientError, ServerError } from "../error.js";

// Modify responses before they are sent to the client
function responseMapper(server: Hono) {
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
      console.error(`ERROR: invaild request payload provided`);

      return new Response(
        JSON.stringify({ error: ClientError.INVALID_PARAMS }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Fallback
    console.error(`ERROR: ${err.message}`);
    return new Response(JSON.stringify({ error: ClientError.SERVICE_ERROR }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  });
}

export { responseMapper };