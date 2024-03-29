class ApiError extends Error {
    constructor(public status: number, public message: string) {
      super();
      this.status = status;
      this.message = message;
    }
  
    static badRequest(message: string) {
      return new ApiError(400, message);
    }

    static notFound(message: string) {
      return new ApiError(404, message);
    }
    static internal(message: string) {
      return new ApiError(500, message);
    }
  };
  
  export default ApiError;