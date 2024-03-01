// Type definitions to add userId to Express.Request:

declare namespace Express {
  export interface Request {
    userId?: string;
  }
}
