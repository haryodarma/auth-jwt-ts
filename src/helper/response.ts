export const ApiResponseMessages = {
  // 2xx
  OK: {
    httpCode: 200,
    status: "OK",
    message: "Request was successful",
  },
  CREATED: {
    httpCode: 201,
    status: "CREATED",
    message: "Resource created successfully",
  },
  ACCEPTED: {
    httpCode: 202,
    status: "ACCEPTED",
    message: "Request accepted and processing",
  },
  NO_CONTENT: {
    httpCode: 204,
    status: "NO_CONTENT",
    message: "No content to return",
  },

  // 4xx
  BAD_REQUEST: {
    httpCode: 400,
    status: "BAD_REQUEST",
    message: "The request is invalid",
  },
  UNAUTHORIZED: {
    httpCode: 401,
    status: "UNAUTHORIZED",
    message: "User is unauthorized",
  },
  FORBIDDEN: {
    httpCode: 403,
    status: "FORBIDDEN",
    message: "Access is forbidden",
  },
  NOT_FOUND: {
    httpCode: 404,
    status: "NOT_FOUND",
    message: "Resource not found",
  },
  CONFLICT: {
    httpCode: 409,
    status: "CONFLICT",
    message: "Conflict with current state of resource",
  },
  UNPROCESSABLE_ENTITY: {
    httpCode: 422,
    status: "UNPROCESSABLE_ENTITY",
    message: "Unprocessable entity",
  },

  // 5xx
  INTERNAL_SERVER_ERROR: {
    httpCode: 500,
    status: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  },
  NOT_IMPLEMENTED: {
    httpCode: 501,
    status: "NOT_IMPLEMENTED",
    message: "This functionality is not implemented",
  },
  BAD_GATEWAY: {
    httpCode: 502,
    status: "BAD_GATEWAY",
    message: "Invalid response from upstream server",
  },
  SERVICE_UNAVAILABLE: {
    httpCode: 503,
    status: "SERVICE_UNAVAILABLE",
    message: "Service temporarily unavailable",
  },
  GATEWAY_TIMEOUT: {
    httpCode: 504,
    status: "GATEWAY_TIMEOUT",
    message: "Upstream server did not respond in time",
  },
} as const;

export type ApiResponseKey = keyof typeof ApiResponseMessages;
