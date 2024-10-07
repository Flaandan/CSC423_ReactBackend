import { Context } from "hono";
import { jwt } from "hono/jwt";
import { config } from "../config.js";
import { ClientError, ServerError } from "../error.js";
import { COOKIE_KEY, JWT_ALG } from "../services/jwtService.js";

function jwtMiddleware(requiredRoles: string[]) {
  return async (ctx: Context, next: () => Promise<void>) => {
    // `jwt` is the default middleware provided by Hono to verify tokens
    await jwt({
      secret: config.jwtSecret,
      cookie: COOKIE_KEY,
      alg: JWT_ALG,
    })(ctx, async () => {
      const payload = ctx.get("jwtPayload");

      // Check role found in payload from token
      if (!requiredRoles.includes(payload.role)) {
        throw new ServerError(
          "Role is not valid for the requested endpoint",
          403,
          ClientError.INVALID_ROLE,
        );
      }

      return await next();
    }).catch((err) => {
      if (err instanceof ServerError) {
        // Propagates the 403 error for invalid role to responseMapper
        throw err;
      }

      // Throw ServerError if jwt verification fails
      throw new ServerError(
        "Authorization token is missing or invalid",
        401,
        ClientError.NO_AUTH,
      );
    });
  };
}

export { jwtMiddleware };
