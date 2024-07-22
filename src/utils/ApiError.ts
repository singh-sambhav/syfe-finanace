class ApiError extends Error {
    statusCode: number;
    message: string;
    success: boolean;
    data: any;
    errors: any;
  
    constructor(
      statusCode: number,
      message = "Something went wrong!",
      errors = [],
      stack = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.message = message;
      this.success = false;
      this.errors = errors;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export default ApiError;
  