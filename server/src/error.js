// Default Client Errors if key is used instead of custom message
export const ClientError = {
  INVALID_CREDENTIALS: "The username or password is incorrect",
  NOT_FOUND: "The requested resource could not be found",
  INVALID_ROLE:
    "You do not have the required permissions to perform this action",
  NO_AUTH: "Authentication is required. Please log in to continue",
  INVALID_PAYLOAD:
    "The provided data is invalid. Please check the request and try again",
  SERVICE_ERROR: "An unexpected issue occurred. Please try again later",
};

export class ServerError extends Error {
  statusCode;
  clientError;

  constructor(message, statusCode, clientErrorKeyOrMessage) {
    super(message);
    this.statusCode = statusCode;

    // Check if clientErrorKeyOrMessage is a key in ClientError; otherwise, use it as a message
    this.clientError =
      ClientError[clientErrorKeyOrMessage] || clientErrorKeyOrMessage;
  }
}
