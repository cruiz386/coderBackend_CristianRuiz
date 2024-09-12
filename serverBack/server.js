import express from "express";
import productsManager from "./src/data/products.manager.js";

try {
  const server = express();
  const PORT = 8080;
  const ready = () => console.log("server ready on port " + PORT);

  server.use(express.json());
  server.use(express.urlencoded({ extended: true })); // Para manejar JSON en las solicitudes

  server.listen(PORT, ready);

  server.get("/", index);
  server.get("/api/products", getAllProducts);
  server.post("/api/products", create);
  server.get("/api/products/:pid", getProductById);
  //server.post("/api/products/:title/:price/:quantity",create)
  server.put("/api/products/:pid", updateProduct);
  server.delete("/api/products/:pid", destroyProduct);
} catch (error) {
  console.log(error);
}

function index(req, res) {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Welcome to my API" });
  } catch (error) {
    const { statusCode, message } = error;
    return res
      .status(statusCode || 500)
      .json({ message: message || "FATAL ERROR" });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await productsManager.readAll();
    if (products.length > 0) {
      return res.status(200).json({ statusCode: 200, response: products });
    } else {
      return res.status(404).json({
        statusCode: 404,
        response: null,
        message: "No products found",
      });
    }
  } catch (error) {
    const { statusCode, message } = error;
    return res
      .status(statusCode || 500)
      .json({ message: message || "FATAL ERROR" });
  }
}

async function getProductById(req, res) {
  try {
    const { pid } = req.params;
    const product = await productsManager.readById(pid);
    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    const { statusCode, message } = error;
    return res
      .status(statusCode || 500)
      .json({ message: message || "FATAL ERROR" });
  }
}

async function create(req, res) {
  try {
    // const { title, price, quantity } = req.params;
    const data = req.body;

    const product = await productsManager.create(data);
    return res.status(201).json({ statusCode: 201, response: product });
  } catch (error) {
    const { statusCode, message } = error;
    return res
      .status(statusCode || 500)
      .json({ message: message || "FATAL ERROR" });
  }
}

async function destroyProduct(req, res) {
  try {
    const { pid } = req.params;
    const product = await productsManager.destroy(pid);
    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    const { statusCode, message } = error;
    return res
      .status(statusCode || 500)
      .json({ message: message || "FATAL ERROR" });
  }
}

async function updateProduct(req, res) {
  try {
    const { pid } = req.params;
    const data = req.body;
    //const { title, price, quantity } = req.body;
    const product = await productsManager.update(pid, data);
    return res.status(201).json({ statusCode: 201, response: product });
  } catch (error) {
    const { statusCode, message } = error;
    return res
      .status(statusCode || 500)
      .json({ message: message || "FATAL ERROR" });
  }
}
