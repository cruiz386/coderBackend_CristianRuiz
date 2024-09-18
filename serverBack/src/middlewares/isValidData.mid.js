function isValidData(req, res, next) {
    // como todo middleware depende de req y de res
    // pero ademas necesita depender de next
    // que es la funcion encargada de "pasar" a la siguiente función (de middleware o controlador)
    try {
      const { title, stock, price } = req.body;
      if (!title || !stock || !price) {
        const error = new Error("Title, stock and price are required");
        error.statusCode = 400;
        throw error;
      } else {
        return next();
      }
    } catch (error) {
      throw error;
    }
  }
  
  export default isValidData;