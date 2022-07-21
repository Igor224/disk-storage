export default class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User unauthorized to access requested resource');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static FileNotFound(message, errors = []) {
    return new ApiError(404, 'File was deleted or not exist');
  }

  static UploadErr(message, errors = []) {
    return new ApiError(500, 'Something went wrong... upload aborted');
  }

  static ClientUpDownloadErr(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static ServerUpDownloadErr(message, errors = []) {
    return new ApiError(500, message, errors);
  }

  static AuthError(message, errors = []) {
    return new ApiError(535, 'Username or Password not accepted');
  }
}
