import express from "express";
import productsManager from "./src/data/managers/products.fs.js";
import userController from "./src/controllers/users.controllers.js";
import { create, destroyProduct, getAllProducts, getProductById, updateProduct } from "./src/controllers/products.controllers.js";
import router from './src/routers/index.router.js'

try {
  const server = express();
  const PORT = 8080;
  const ready = () => console.log("server ready on port " + PORT);

  server.use(express.json());
  server.use(express.urlencoded({ extended: true })); // Para manejar JSON en las solicitudes
  server.use('/',router); // ruta principal 
  server.listen(PORT, ready);

} catch (error) {
  console.log(error);
}




