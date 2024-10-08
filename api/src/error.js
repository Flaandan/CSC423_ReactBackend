const ClientError = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NOT_FOUND: "NOT_FOUND",
  INVALID_ROLE: "INVALID_ROLE",
  NO_AUTH: "NO_AUTH",
  CONFLICT: "CONFLICT",
  INVALID_PAYLOAD: "INVALID_PAYLOAD",
  SERVICE_ERROR: "SERVICE_ERROR",
};

class ServerError extends Error {
  statusCode;

  clientError;

  constructor(message, statusCode, clientError) {
    super(message);
    this.statusCode = statusCode;
    this.clientError = clientError;
  }
}

export { ClientError, ServerError };
