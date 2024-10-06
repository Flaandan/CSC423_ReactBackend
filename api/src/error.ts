class ServerError extends Error {
  statusCode: number;
  clientError: ClientError;

  constructor(message: string, statusCode: number, clientError: ClientError) {
    super(message);
    this.statusCode = statusCode;
    this.clientError = clientError;
  }
}

enum ClientError {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  NOT_FOUND = "NOT_FOUND",
  INVALID_PERMISSIONS = "INVALID_PERMISSIONS",
  NO_AUTH = "NO_AUTH",
  CONFLICT = "CONFLICT",
  INVALID_PAYLOAD = "INVALID_PAYLOAD",
  SERVICE_ERROR = "SERVICE_ERROR",
}

export { ServerError, ClientError };
