function errorHandler(error, req, res, next) {
    const { statusCode, message } = error;
    console.log(error);
    return res
      .status(statusCode || 500)
      .json({ message: message || "FATAL ERROR" });
  }
  
  export default errorHandler