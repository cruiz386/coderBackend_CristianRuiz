// socket back end
import productMongoManager from "../data/mongo/managers/product.mongo.js";
import userMongoManager from "../data/mongo/managers/user.mongo.js";



const socketCb = (socket) => {
  console.log(`Client ${socket.id} connected`);

// PRODUCTS

  // Emitir todos los productos a los clientes conectados
  const emitAllProducts = async () => { 
    const allProducts = await productMongoManager.readAll();
    socket.emit("update products", allProducts);
  };

  // Producto CRUD
  socket.on("add product", async (productData) => {
    await productMongoManager.create(productData);
    await emitAllProducts();
  });

  socket.on("delete product", async (productId) => {
    await productMongoManager.destroy(productId);
    await emitAllProducts();
  });

  socket.on("update product", async (productData) => {
    await productMongoManager.update(productData.id, productData);
    await emitAllProducts();
  });
 
  // Búsqueda de productos  
  socket.on("search products", async ({ pid, category }) => {
    const allProducts = await productMongoManager.readAll();
    const filteredProducts = allProducts.filter(product => {
      return (!pid || product._id.toString() === pid) &&
        (!category || product.category.toLowerCase().includes(category.toLowerCase()));
    });
    socket.emit("update filtered products", filteredProducts);
  });

  emitAllProducts();


  // USERS 

  // Gestión de usuarios
  socket.on("new user", async (data) => {
    await userMongoManager.create(data);
    const allUsers = await userMongoManager.readAll();
    socket.emit("update user", allUsers);
  }); 

  socket.on("user login", async ({ email, password }) => {
    console.log(`Received email: ${email}, password: ${password}`);
    try {
      const user = await userMongoManager.findUser(email, password);
      if (!user) {
        socket.emit("login response", {
          success: false,
          message: "Invalid username or password"
        });
      } else {
       
        socket.emit("login response", {
          success: true,
          user: user
        });
      }
    } catch (error) {
      console.error(error);
      socket.emit("login response", {
        success: false,
        message: error.message
      });
    }
  });

  socket.on("user update", async (data) => {
    await userMongoManager.update(data.id, data);
    const allUsers = await userMongoManager.readAll();   
    socket.emit("update user", allUsers);
  }); 

  socket.on("user delete", async (id) => {
    await userMongoManager.destroy(id);
    const allUsers = await userMongoManager.readAll();
    socket.emit("update user", allUsers);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });

}  
export default socketCb;