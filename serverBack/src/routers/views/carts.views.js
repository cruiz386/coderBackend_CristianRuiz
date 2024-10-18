import { Router } from "express";
import {   showCartByUser } from "../../controllers/cart.controller.js";


const cartViewRouter = Router();


cartViewRouter.get("/:uid", showCartByUser);



export default cartViewRouter;
