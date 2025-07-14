type Status = 200 | 404 | 401 | 401 | 409;

export class AppError extends Error {
  public status: Status;
  public errorCode: string;

  public constructor(message: string, status: Status, errorCode: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

export class NotFoundError extends AppError {
  public constructor(message: string) {
    super(message, 404, "not_found");
  }
}

export class AlreadyExistsError extends AppError {
  public constructor(message: string) {
    super(message, 409, "already_exists");
  }
}

export class UnauthenticatedError extends AppError {
  public constructor() {
    super("Unauthenticated", 401, "unauthenticated");
  }
}
