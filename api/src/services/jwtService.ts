import { decode, sign, verify } from "hono/jwt";
import { TokenHeader } from "hono/utils/jwt/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { config } from "../config.js";
import { ClientError, ServerError } from "../error.js";
import { UserDTO } from "../models/user.js";

const COOKIE_KEY = "token";
const JWT_ALG = "HS256";

async function generateToken(userDetails: UserDTO): Promise<string> {
  const claims: JWTPayload = {
    sub: userDetails.username,
    role: userDetails.role,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  };

  return await sign(claims, config.jwtSecret, JWT_ALG);
}

async function verifyToken(token: string): Promise<JWTPayload> {
  return await verify(token, config.jwtSecret).catch((err) => {
    throw new ServerError(
      `Failed to verify JWT: ${String(err)}`,
      409,
      ClientError.NO_AUTH,
    );
  });
}

function decodeToken(token: string): {
  header: TokenHeader;
  payload: JWTPayload;
} {
  return decode(token);
}

export { COOKIE_KEY, JWT_ALG, decodeToken, generateToken, verifyToken };
