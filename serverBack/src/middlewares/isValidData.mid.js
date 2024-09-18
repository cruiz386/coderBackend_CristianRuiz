function isValidData(req, res, next) {
    // como todo middleware depende de req y de res
    // pero ademas necesita depender de next
    // que es la funcion encargada de "pasar" a la siguiente función (de middleware o controlador)
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