import { Router } from "express";
import {   showCartByUser } from "../../controllers/cart.controller.js";


const cartViewRouter = Router();

// Ruta para mostrar la vista del carrito
cartViewRouter.get("/:userId", showCartByUser);



export default cartViewRouter;
