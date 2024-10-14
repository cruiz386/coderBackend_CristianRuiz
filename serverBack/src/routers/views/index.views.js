import { Router } from "express";
import productsViewRouter from "./products.views.js";
import cartViewRouter from "./carts.views.js";
import usersViewRouter from "./users.views.js";
import {productsIndexView} from "../../controllers/products.controllers.js";

const viewRouter = Router()


viewRouter.use("/products", productsViewRouter);
viewRouter.use("/cart", cartViewRouter);
viewRouter.use("/users", usersViewRouter);
viewRouter.use("/", productsIndexView); 
 

export default viewRouter