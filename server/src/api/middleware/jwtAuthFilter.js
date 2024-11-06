import { jwt } from "hono/jwt";
import { config } from "../../config.js";
import { ClientError, ServerError } from "../../error.js";
import { JWT_ALG } from "../services/jwtService.js";

export function jwtFilter() {
  return async (ctx, next) => {
    // `jwt` is the default middleware provided by Hono to verify tokens
    // Defaults to checking for Authentication (Bearer or Basic) header if cookie field is not provided
    try {
      await jwt({
        secret: config.jwtSecret,
        alg: JWT_ALG,
      })(ctx, async () => {
        return await next();
      });
    } catch (err) {
      // Throw ServerError if jwt verification fails
      throw new ServerError(
        `Token verification error: ${String(err.message)}`,
        401,
        ClientError.NO_AUTH,
      );
    }
  };
}
