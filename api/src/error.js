const ClientError = {
  INVALID_CREDENTIALS: "Invalid credentials",
  NOT_FOUND: "Requested resource not found",
  INVALID_ROLE:
    "You do not have the required permissions to access this resource",
  NO_AUTH: "Authentication required. Please log in",
  USER_CONFLICT: "An account with this username already exists",
  INVALID_PAYLOAD: "The data provided in the request is not valid",
  SERVICE_ERROR: "Something went wrong on our end. Please try again later",
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
