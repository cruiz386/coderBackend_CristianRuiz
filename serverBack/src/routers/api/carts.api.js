import { Router } from "express";
import {create, destroy, read, readAll, update, calculateTotal} from "../../controllers/cart.controller.js"; 

const cartsApiRouter = Router();
 
// Rutas de la API del carrito
cartsApiRouter.post("/", create);
cartsApiRouter.get("/", readAll);
cartsApiRouter.get("/:cid", read);
cartsApiRouter.put("/:cid", update);
cartsApiRouter.delete("/:cid", destroy);
cartsApiRouter.get("/total/:uid", calculateTotal);

export default cartsApiRouter;
