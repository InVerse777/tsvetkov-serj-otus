import httpStatusCodes from "../errorHandling/httpStatusCodes.js";
import BaseError from "../errorHandling/baseError.js";

export class Error404 extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Not found."
  ) {
    super(name, statusCode, description);
  }
}
export class Error400 extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = "Bad request."
  ) {
    super(name, statusCode, description);
  }
}
export class Error403 extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.FORBIDDEN,
    description = "You are not authorized to view this page or make this operation."
  ) {
    super(name, statusCode, description);
  }
}
export class Error401 extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.UNAUTHORIZED,
    description = "Wrong credentials or not provided any credentials"
  ) {
    super(name, statusCode, description);
  }
}
export default { Error404, Error400, Error403, Error401 };
