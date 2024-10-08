import { jwt } from "hono/jwt";
import { config } from "../config.js";
import { ClientError, ServerError } from "../error.js";
import { COOKIE_KEY, JWT_ALG } from "../services/jwtService.js";

function jwtCheck() {
  return async (ctx, next) => {
    // `jwt` is the default middleware provided by Hono to verify tokens
    try {
      await jwt({
        secret: config.jwtSecret,
        cookie: COOKIE_KEY,
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

export { jwtCheck };
