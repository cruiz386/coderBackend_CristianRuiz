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

async function showProducts(req, res, next) {
  try {
    let { category } = req.query;
    let all;
    if (!category) {
      all = await productsFileManager.readAll();
    } else {
      all = await productsFileManager.readAll(category);
    }
    if (all.length > 0) {
      return res.render("products", { products: all });

    } else {
      const error = new Error("NOT FOUND PRODUCTS");
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
    const response = await productsFileManager.readById(pid);

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
    const products = await productsFileManager.readAll(category);

    if (products.length > 0) {
      return res.render("categoryproducts", { products, category });
    } else {
      const error = new Error("No products found in this category");
      error.statusCode = 404;
      throw error;
    }
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
  showProducts,
  showOneProduct,
  showProductsByCategory,
};
