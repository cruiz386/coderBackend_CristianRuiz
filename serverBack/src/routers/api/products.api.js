import { Router } from "express"
import { create, destroyProduct, getAllProducts, getProductById, updateProduct } from "../../controllers/products.controllers.js";
import isValidData from "../../middlewares/isValidData.mid.js";

const productsRouter = Router()

productsRouter.get('/api/products/',getAllProducts)
productsRouter.get('/api/products/:pid',getProductById)

productsRouter.post("/", isValidData, create);

productsRouter.post('/api/products',create)

productsRouter.put('/api/products/:pid',updateProduct)
productsRouter.delete('/api/products/:pid',destroyProduct)

export default productsRouter


