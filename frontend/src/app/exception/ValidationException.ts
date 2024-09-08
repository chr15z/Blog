export class ValidationException extends Error {
  constructor(message: string, public errors: string[]) {
    super(message);
    this.name = "ValidationException";
  }
}
