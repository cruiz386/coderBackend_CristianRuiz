import { Router } from "express"
import userController from "../../controllers/users.controllers.js";

const usersRouter = Router()

usersRouter.get('/api/users',userController.readUsers)
usersRouter.get('/api/users/:uid"',userController.readUsers)
usersRouter.post('/api/users',userController.createUser)
usersRouter.put('/api/users/:uid"',userController.updateUser)
usersRouter.delete('/api/users/:uid"',userController.deleteUser)


export default usersRouter

