import { Router } from "express"
import usersRouter from "./users.api.js"
import productsRouter from "./products.api.js"

const apiRouter = Router()

apiRouter.use('/users', usersRouter)
apiRouter.use('/products', productsRouter)
//apiRouter.use('/carts', cartsRouter)

// server.get("/api/products", getAllProducts);
// server.get("/api/products/:pid", getProductById);
// //server.post("/api/products/:title/:price/:quantity",create)
// server.post("/api/products", create);
// server.put("/api/products/:pid", updateProduct);
// server.delete("/api/products/:pid", destroyProduct);

export default apiRouter