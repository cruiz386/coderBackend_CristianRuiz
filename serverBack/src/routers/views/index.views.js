import { Router } from "express";
import productsViewRouter from "./products.views.js";
import cartsViewRouter from "./carts.views.js";
import usersViewRouter from "./users.views.js";

const viewRouter = Router()


viewRouter.use("/products", productsViewRouter);
viewRouter.use("/carts", cartsViewRouter);
viewRouter.use("/users", usersViewRouter);

export default viewRouter