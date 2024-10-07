import { Router } from "express";
import productsViewRouter from "./products.views.js";
import cartsViewRouter from "./carts.views.js";
import usersViewRouter from "./users.views.js";

const viewRouter = Router()


viewRouter.use("/products", productsViewRouter);
viewRouter.use("/carts", cartsViewRouter);
viewRouter.use("/users", usersViewRouter);
 
viewRouter.use("/", (req, res, next) => {
  try {
    return res.render("index")
  } catch (error) {
    return next(error)
  }
})

export default viewRouter