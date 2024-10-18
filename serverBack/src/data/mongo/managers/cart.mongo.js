//carts manager de mongo - utiliza el manager generico manager.mongo

import Cart from "../models/cart.model.js";
import Manager from "./manager.mongo.js";


const cartsManager = new Manager(Cart);
export default cartsManager;