import crypto from "crypto";

function isValidDataProduct(req, res, next) {
  try {
    const { title, stock, price, category, photo } = req.body;

    // Validación de Producto
    if (!title || typeof title !== 'string') {
      throw new Error("Title is required and must be a string");
    }
    if (!price || isNaN(price) || price <= 0) {
      req.body.price = 1; // Valor por defecto
    }
    if (!stock || isNaN(stock) || stock < 0) {
      req.body.stock = 1; // Valor por defecto
    }
    if (!category) {
      req.body.category = "default"; // Valor por defecto
    }
    if (!photo) {
      req.body.photo = "default_photo_url"; // Valor por defecto
    }

    return next();
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
}

export default isValidDataProduct;
