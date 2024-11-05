import { Router } from "express"
import { create, destroyProduct, getAllProducts, getProductById, updateProduct, paginate } from "../../controllers/products.controllers.js";
import isValidDataProduct from "../../middlewares/isValidDataProducts.mid.js";

const productsRouter = Router();

productsRouter.get('/', getAllProducts)
productsRouter.get('/paginate', paginate)
productsRouter.get('/:pid', getProductById)
productsRouter.post("/", isValidDataProduct, create);
productsRouter.put('/:pid', isValidDataProduct, updateProduct);
productsRouter.delete('/:pid', destroyProduct)


export default productsRouter


