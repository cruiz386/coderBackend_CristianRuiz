import productsFileManager from "../data/files/products.fileManager.js";
import productsMemoryManager from "../data/memory/products.memoryManager.js";


async function syncProductManagers() {
  const productsFromFile = await productsFileManager.readAll();
  productsMemoryManager.sync(productsFromFile);
}

async function getAllProducts(req, res, next) {
  try {
    let { category } = req.query;

    await syncProductManagers();

    let response;
    if (!category) {
      response = await productsFileManager.readAll();
    } else {
      response = await productsFileManager.readAll(category);
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

    await syncProductManagers();

    const product = await productsFileManager.readById(pid);
    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = req.body;
    const product = await productsFileManager.create(data);

    await syncProductManagers();

    return res.status(201).json({ statusCode: 201, response: product });
  } catch (error) {
    return next(error);
  }
}

async function destroyProduct(req, res, next) {
  try {
    const { pid } = req.params;
    const product = await productsFileManager.destroy(pid);

    await syncProductManagers();

    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { pid } = req.params;
    const data = req.body;
    const product = await productsFileManager.update(pid, data);

    await syncProductManagers();

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
