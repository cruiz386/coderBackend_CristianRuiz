
// products controller con Mongo

import productMongoManager from "../data/mongo/managers/product.mongo.js";


async function create(req, res, next) {
  try {
    const data = req.body;
    const product = await productMongoManager.create(data);
    return res.status(201).json({ message: "PRODUCT CREATED", statusCode: 201, response: product });
  } catch (error) {
    return next(error);
  }
}

async function getAllProducts(req, res, next) {
  try {
    const products = await productMongoManager.readAll();
    return res.status(200).json({ message: "PRODUCTS READ", response: products });
  } catch (error) {
    return next(error);
  } 
}

async function getProductById(req, res, next) {
  try {
    const { pid } = req.params;
    const product = await productMongoManager.readById(pid);
    return res.status(200).json({ message: "PRODUCT READ", response: product });
  } catch (error) {
    return next(error);
  }
}

async function destroyProduct(req, res, next) {
  try {
    const { pid } = req.params;
    const product = await productMongoManager.destroy(pid);
    return res.status(200).json({ message: "PRODUCT DESTROYED", statusCode: 200, response: product });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { pid } = req.params;
    const data = req.body;
    const product = await productMongoManager.update(pid, data);
    return res.status(200).json({ message: "PRODUCT UPDATED", statusCode: 200, response: product });
  } catch (error) {
    return next(error);
  }
}

async function showProducts(req, res, next) {
  try {
    const { category } = req.query;

    // Obtener todos los productos, filtrando por categoría si se proporciona
    const all = await productMongoManager.readAll(category); // Asegúrate de que la categoría se pase aquí
    //console.log(all); // Para verificar qué productos se están obteniendo

    // Verificar si se encontraron productos
    if (all.length > 0) {
      return res.render("products", { products: all, category });
    } else {
      // En caso de que no se encuentren productos, devolver un error
      const error = new Error("No products found.");
      error.statusCode = 404;
      throw error; // Esto será manejado en el middleware de error
    }
  } catch (error) {
    // Pasar el error al siguiente middleware
    return next(error);
  }
}


async function showOneProduct(req, res, next) {
  
  try {
    const { pid } = req.params;
    const response = await productMongoManager.readById(pid);
    if (response) {
      return res.render("oneproduct", { one: response });
    } else {
      const error = new Error("NOT FOUND PRODUCT");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    return next(error);
  }
}
 
async function showProductsByCategory(req, res, next) {
  try {
    const { category } = req.params;
    const products = await productMongoManager.readAll(category);
    if (products.length > 0) {
      return res.render("categoryproducts", { products, category });
    } else {
      return res.render("productsNotFound");
      const error = new Error("No products found in this category");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    return next(error);
  }
}

async function adminProducts(req, res, next) {
  try {
    const products = await productMongoManager.readAll();
    return res.render("adminproducts", { products });
  } catch (error) {
    return next(error);
  }
}

 
export { create, getAllProducts, getProductById, destroyProduct, updateProduct, showProducts, showOneProduct, showProductsByCategory, adminProducts };