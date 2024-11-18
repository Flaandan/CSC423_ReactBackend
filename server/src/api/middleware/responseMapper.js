import { ZodError } from "zod";
import { ClientError, ServerError } from "../../error.js";

// Modify responses before they are sent to the client. All errors should be propagated here
export function responseMapper(server) {
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
      console.log(err.message);
      const errorMessages = err.errors.map((error) => {
        const path = error.path.join(".");

        if (error.message === "Required") {
          return `${path} required`;
        }

        if (error.message.includes("Unrecognized key(s) in object")) {
          return "Invalid fields provided";
        }

        return `${error.message}`;
      });

      console.error("ERROR:", errorMessages[0]);

      const hasRequiredError = err.errors.some(
        (error) =>
          error.message === "Required" ||
          error.message.includes("Unrecognized key(s) in object"),
      );

      return new Response(
        JSON.stringify({
          error: hasRequiredError
            ? ClientError.INVALID_PAYLOAD
            : errorMessages[0],
        }),
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
