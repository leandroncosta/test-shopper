
export class ReadingNotFoundException extends Error {
  public error: string

  constructor(message: string, error?: string) {
    super(message);
    this.name = this.constructor.name;
    this.error = error!
    Error.captureStackTrace(this, this.constructor);
  }
}