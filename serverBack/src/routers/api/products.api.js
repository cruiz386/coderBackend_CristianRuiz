import { Router } from "express"
import { create, destroyProduct, getAllProducts, getProductById, updateProduct } from "../../controllers/products.controllers.js";
import isValidData from "../../middlewares/isValidData.mid.js";

const productsRouter = Router();

productsRouter.get('/',getAllProducts)
productsRouter.get('/:pid',getProductById)

productsRouter.post("/", isValidData, create);

productsRouter.put('/:pid',updateProduct)
productsRouter.delete('/:pid',destroyProduct)

export default productsRouter


