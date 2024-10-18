
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

async function paginate(req, res, next) {
  try {
    //const filter = req.query;
    const { page, limit } = req.query;
    const products = await productMongoManager.paginate({}, { page, limit });

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
    const { category, page = 1, limit = 8 } = req.query;
    const all = await productMongoManager.paginate(category, { page, limit });
    if (all.docs.length > 0) {
      return res.render("products", {
        products: all.docs, 
        totalPages: all.totalPages,
        currentPage: all.page, 
        hasPrevPage: all.hasPrevPage, 
        hasNextPage: all.hasNextPage, 
        prevPage: all.prevPage, 
        nextPage: all.nextPage, 
        category 
      });

    } else {
      const error = new Error("No products found.");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    return next(error);
  }
}


async function productsIndexView(req, res, next) {
  try {
    const { category, page = 1, limit = 8 } = req.query;
    const all = await productMongoManager.paginate(category, { page, limit });
    if (all.docs.length > 0) {
      return res.render("index", {
        products: all.docs, 
        totalPages: all.totalPages,
        currentPage: all.page, 
        hasPrevPage: all.hasPrevPage, 
        hasNextPage: all.hasNextPage, 
        prevPage: all.prevPage, 
        nextPage: all.nextPage, 
        category 
      });

    } else {
      const error = new Error("No products found.");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
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


export { create, getAllProducts, getProductById, destroyProduct, updateProduct, showProducts, showOneProduct, showProductsByCategory, adminProducts, productsIndexView, paginate };