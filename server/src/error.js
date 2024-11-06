export const ClientError = {
  INVALID_CREDENTIALS: "The username or password provided is incorrect",
  NOT_FOUND: "The requested resource could not be found",
  INVALID_ROLE:
    "You do not have the necessary permissions to access this resource",
  NO_AUTH: "Authentication is required to access this resource. Please log in",
  CONFLICT: "A conflict occurred. The record already exists",
  INVALID_PAYLOAD:
    "The data provided in the request is not valid. Please ensure all fields are correct",
  SERVICE_ERROR:
    "An unexpected issue occurred on our end. Please try again later",
};

export class ServerError extends Error {
  statusCode;

  clientError;

  constructor(message, statusCode, clientError) {
    super(message);
    this.statusCode = statusCode;
    this.clientError = clientError;
  }
}
