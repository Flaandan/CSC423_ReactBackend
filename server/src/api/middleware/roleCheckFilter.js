import { jwt } from "hono/jwt";
import { config } from "../../config.js";
import { ClientError, ServerError } from "../../error.js";
import { JWT_ALG } from "../utils/jwt/generate.js";

export function roleFilter(requiredRoles) {
    return async (ctx, next) => {
        // `jwt` is the default middleware provided by Hono to verify tokens
        // Defaults to checking for Authentication (Bearer or Basic) header if cookie field is not provided
        try {
            await jwt({
                secret: config.jwtSecret,
                alg: JWT_ALG,
            })(ctx, async () => {
                const token = ctx.get("jwtPayload");

                // Check role found in payload from token
                if (!requiredRoles.includes(token.user_role)) {
                    throw new ServerError(
                        "Role is not valid for the requested endpoint",
                        403,
                        ClientError.INVALID_ROLE,
                    );
                }

                return await next();
            });
        } catch (err) {
            if (err instanceof ServerError) {
                // Propagates the 403 error for invalid role to responseMapper
                throw err;
            }

            // Throw ServerError if jwt verification fails
            throw new ServerError(
                `Token verification error: ${String(err.message)}`,
                401,
                ClientError.NO_AUTH,
            );
        }
    };
}
