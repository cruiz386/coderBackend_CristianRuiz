function isValidData(req, res, next) {

    try {
        const { title, stock, price } = req.body;
        if (!title || typeof title !== 'string') {
          throw new Error("Title is required and must be a string");
        }
        if (!price || isNaN(price) || price <= 0) {
          throw new Error("Price is required and must be a positive number");
        }
        if (!stock || isNaN(stock) || stock < 0) {
          throw new Error("Stock is required and must be a non-negative integer");
        }
        return next();
      } catch (error) {
        error.statusCode = 400;
        return next(error);
      }
  }
  
  export default isValidData;