import { Router } from "express"
import apiRouter from "./api/index.api.js"
import viewsRouter from "./views/index.views.js"



const router = Router()

router.use('/api', apiRouter)
router.use('/', viewsRouter)
router.use('/login', viewsRouter)





export default router




