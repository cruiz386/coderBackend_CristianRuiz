import { Router } from "express";
import { registerView, loginView, logoutView, profileView } from "../../controllers/users.controllers.js";

const usersViewRouter = Router()

usersViewRouter.get("/register", registerView)
usersViewRouter.get("/login", loginView)
usersViewRouter.get("/logout", logoutView)
usersViewRouter.get("/profile/:_id", profileView)


export default usersViewRouter    