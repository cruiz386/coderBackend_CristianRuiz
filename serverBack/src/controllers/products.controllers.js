import productsManager from "../data/managers/products.manager.js";

async function getAllProducts(req, res, next) {
  try {
    let { category } = req.query;
    let response;
    if (!category) {
      response = await productsManager.readAll();
    } else {
      response = await productsManager.readAll(category);
    }
    if (response.length > 0) {
      return res.status(200).json({ message: "PRODUCTS READ", response });
    } else {
      const error = new Error("NOT FOUND PRODUCTS");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    return next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { pid } = req.params;
    const product = await productsManager.readById(pid);
    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    // const { title, price, quantity } = req.params;
    const data = req.body;

    const product = await productsManager.create(data);
    return res.status(201).json({ statusCode: 201, response: product });
  } catch (error) {
    return next(error);
  }
}

async function destroyProduct(req, res, next) {
  try {
    const { pid } = req.params;
    const product = await productsManager.destroy(pid);
    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { pid } = req.params;
    const data = req.body;
    //const { title, price, quantity } = req.body;
    const product = await productsManager.update(pid, data);
    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    return next(error);
  }
}

export {
  updateProduct,
  destroyProduct,
  create,
  getProductById,
  getAllProducts,
};
