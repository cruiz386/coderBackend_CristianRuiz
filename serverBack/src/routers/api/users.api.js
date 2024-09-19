import { Router } from "express"
import userController from "../../controllers/users.controllers.js";

const usersRouter = Router()

usersRouter.get('/',userController.readUsers)
usersRouter.get('/:uid',userController.readUserById)
usersRouter.post('/',userController.createUser)
usersRouter.put('/:uid',userController.updateUser)
usersRouter.delete('/:uid',userController.deleteUser)


export default usersRouter

