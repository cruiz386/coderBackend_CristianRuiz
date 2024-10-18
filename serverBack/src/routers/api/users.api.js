import { Router } from "express"
import userController from "../../controllers/users.controllers.js";
import isValidDataUser from "../../middlewares/isValidDataUsers.mid.js";

const usersRouter = Router()

usersRouter.get('/', userController.readUsers)
usersRouter.get('/:uid', userController.readUserById)
usersRouter.post("/",isValidDataUser, userController.createUser);
usersRouter.put('/:uid',isValidDataUser, userController.updateUser);
usersRouter.delete('/:uid', userController.deleteUser)


export default usersRouter

