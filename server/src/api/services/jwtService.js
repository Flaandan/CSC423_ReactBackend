import { decode, sign, verify } from "hono/jwt";
import { config } from "../../config.js";
import { ClientError, ServerError } from "../../error.js";

const JWT_ALG = "HS256";

async function generateToken(user) {
  const claims = {
    sub: user.username,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    // TODO: Change this
    // Tokens expire after a month until we implement a way to regenerate
    // JWTs for users (e.g. refresh tokens)
    exp: Math.floor(Date.now() / 1000) + 60 * 43_830,
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

export { decodeToken, generateToken, JWT_ALG, verifyToken };
