import { decode, sign, verify } from "hono/jwt";
import { config } from "../config.js";
import { ClientError, ServerError } from "../error.js";

const JWT_ALG = "HS256";

async function generateAccessToken(user) {
  const claims = {
    sub: user.username,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 15, // Token expires in 15 minutes
  };

  return await sign(claims, config.jwtSecret, JWT_ALG);
}

async function verifyToken(token) {
  return await verify(token, config.jwtSecret).catch((err) => {
    throw new ServerError(
      `Failed to verify JWT: ${String(err)}`,
      409,
      ClientError.NO_AUTH,
    );
  });
}

function decodeToken(token) {
  const { header, payload } = decode(token);
  return { header, payload };
}

export { decodeToken, generateAccessToken, JWT_ALG, verifyToken };
