import { Router } from "express";
import { showProducts, showOneProduct,showProductsByCategory } from "../../controllers/products.controllers.js";

const productsViewRouter = Router()

productsViewRouter.get("/", showProducts)
productsViewRouter.get("/:pid", showOneProduct)
productsViewRouter.get("/category/:category", showProductsByCategory)


export default productsViewRouter