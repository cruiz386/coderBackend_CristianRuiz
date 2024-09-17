import { Router } from "express"
import apiRouter from "./api/index.api.js"
//import viewsRouter from "./views/index.views.js"
import userController from "../controllers/users.controllers.js";


const router = Router()

router.use('/api', apiRouter)
//router.use('/', viewsRouter)


   //server.get("/", index);


 



export default router

function index(req, res) {
    try {
      return res
        .status(200)
        .json({ success: true, message: "Welcome to my API" });
    } catch (error) {
      const { statusCode, message } = error;
      return res
        .status(statusCode || 500)
        .json({ message: message || "FATAL ERROR" });
    }
  }
