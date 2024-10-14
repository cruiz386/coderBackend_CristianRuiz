import { Router } from "express";
import {create, destroy, read, readAll, update} from "../../controllers/cart.controller.js"; // Asegúrate de importar el controlador

const cartsApiRouter = Router();
 
// Rutas de la API del carrito
cartsApiRouter.post("/", create);
cartsApiRouter.get("/", readAll);
cartsApiRouter.get("/:cid", read);
cartsApiRouter.put("/:cid", update);
cartsApiRouter.delete("/:cid", destroy);

export default cartsApiRouter;
