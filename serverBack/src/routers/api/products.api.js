import { Router } from "express"
import { create, destroyProduct, getAllProducts, getProductById, updateProduct } from "../../controllers/products.controllers.js";

const productsRouter = Router()

productsRouter.post('/api/products',create)
productsRouter.get('/api/products/',getAllProducts)
productsRouter.get('/api/products/:pid',getProductById)
productsRouter.put('/api/products/:pid',updateProduct)
productsRouter.delete('/api/products/:pid',destroyProduct)

export default productsRouter


