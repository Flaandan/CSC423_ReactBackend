import { sign } from "hono/jwt";
import { config } from "../../../config.js";
import { Claims } from "./claims.js";

export const JWT_ALG = "HS256";

export async function generateAccessToken(userDTO) {
  const claims = new Claims(userDTO.username, userDTO.role, userDTO.id);

  return await sign(claims, config.jwtSecret, JWT_ALG);
}

// export async function verifyToken(token) {
//   return await verify(token, config.jwtSecret).catch((err) => {
//     throw new ServerError(
//       `Failed to verify JWT: ${String(err)}`,
//       409,
//       ClientError.NO_AUTH,
//     );
//   });
// }
//
// export function decodeToken(token) {
//   const { header, payload } = decode(token);
//   return { header, payload };
// }
