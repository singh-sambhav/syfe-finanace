class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;
  
    constructor(statusCode: number, data: any, message: string) {
      this.statusCode = statusCode;
      this.message = message || "Success";
      this.data = data;
      this.success = true;
    }
  }
  
  export default ApiResponse;
  