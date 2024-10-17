export function decodeJWT(jwt) {
  if (!jwt) {
    throw new Error("no JWT provided");
  }

  const parts = jwt.split(".");

  if (parts.length !== 3) {
    throw new Error("invalid JWT format");
  }

  const payload = parts[1];

  const decodedPayload = JSON.parse(
    atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
  );

  return decodedPayload;
}
