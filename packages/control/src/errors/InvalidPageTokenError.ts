
export class InvalidPageTokenError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}