export class InvalidRequestException extends Error {
  public error: string = "INVALID_DATA";

  constructor(message: string, error?: string) {
    super(message);
    this.name = this.constructor.name;
    this.error = error!
    Error.captureStackTrace(this, this.constructor);
  }
}