import express from "express";
import productsManager from "./src/data/products.manager.js";

const server = express();
server.use(express.json()); // Para manejar JSON en las solicitudes

const PORT = 8080;
const ready = () => console.log("server ready on port " + PORT);

server.listen(PORT, ready);

// server.get(ruta, callback)
// server.post(ruta, callback)
// server.put(ruta, callback)
// server.delete(ruta, callback)

server.get("/", (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Welcome to my API" });
  } catch (error) {
    const {statusCodem, message} = error
    return res.status(statusCode ||500).json({  message: message  || "FATAL ERROR" });
  }
});

// Obtener todos los productos
server.get("/api/products", async (req, res) => {
  try {
    const products = await productsManager.read();
    if (products.length > 0) {
      return res.status(200).json({ statusCode: 200, response: products });
    } else {
      return res.status(404).json({ statusCode: 404, response: null, message: "No products found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || "FATAL ERROR" });
  }
});

// Obtener un producto por ID
server.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsManager.readById(id);
    
    return res.status(200).json({ statusCode: 200, response: product });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ statusCode: error.statusCode || 500, response: null, message: error.message || "FATAL ERROR" });
  }
});
