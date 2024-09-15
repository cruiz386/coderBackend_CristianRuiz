import express from "express";
import productsManager from "./src/data/managers/products.manager.js";
import userController from "./src/controllers/users.controllers.js";
import { create, destroyProduct, getAllProducts, getProductById, updateProduct } from "./src/controllers/products.controllers.js";


try {
  const server = express();
  const PORT = 8080;
  const ready = () => console.log("server ready on port " + PORT);

  server.use(express.json());
  server.use(express.urlencoded({ extended: true })); // Para manejar JSON en las solicitudes

  server.listen(PORT, ready);

  server.get("/", index);
  server.get("/api/products", getAllProducts);
  server.get("/api/products/:pid", getProductById);
  //server.post("/api/products/:title/:price/:quantity",create)
  server.post("/api/products", create);
  server.put("/api/products/:pid", updateProduct);
  server.delete("/api/products/:pid", destroyProduct);

  server.get("/api/users", userController.readUsers);
  server.post("/api/users", userController.createUser);


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


