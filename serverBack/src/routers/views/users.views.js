import { Router } from "express";
import {registerView} from "../../controllers/users.controllers.js";

const usersViewRouter = Router()

usersViewRouter.get("/register", registerView )

export default usersViewRouter