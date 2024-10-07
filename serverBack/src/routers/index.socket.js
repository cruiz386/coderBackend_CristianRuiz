import productsFileManager from "../data/files/products.fileManager.js";
import usersFileManager from "../data/files/users.fileManager.js";

const socketCb = (socket) => {
  console.log(`Client ${socket.id} connected`);


  // PRODUCTS

  // Emitir todos los productos a los clientes conectados
  const emitAllProducts = async () => {
    const allProducts = await productsFileManager.readAll();
    socket.emit("update products", allProducts);
  };

  // Producto CRUD
  socket.on("add product", async (productData) => {
    await productsFileManager.create(productData);
    await emitAllProducts();
  });

  socket.on("delete product", async (productId) => {
    await productsFileManager.destroy(productId);
    await emitAllProducts();
  });

  socket.on("update product", async (productData) => {
    await productsFileManager.update(productData.id, productData);
    await emitAllProducts();
  });

  // Búsqueda de productos
  socket.on("search products", async ({ pid, category }) => {
    const allProducts = await productsFileManager.readAll();
    const filteredProducts = allProducts.filter(product => {
      return (!pid || product.id.toString() === pid) &&
        (!category || product.category.toLowerCase().includes(category.toLowerCase()));
    });
    socket.emit("update filtered products", filteredProducts);
  });

  emitAllProducts();



  // USERS 

  // Gestión de usuarios
  socket.on("new user", async (data) => {
    await usersFileManager.create(data);
    const allUsers = await usersFileManager.readAll();
    socket.emit("update user", allUsers);
  });
 


  socket.on("user login", async ({ email, password }) => {
    console.log(`Received email: ${email}, password: ${password}`);
    try {
      const user = await usersFileManager.findUser(email, password);
      if (!user) {
        // Enviar mensaje de error si no se encuentra el usuario
        socket.emit("login response", {
          success: false,
          message: "Invalid username or password"
        });
      } else {
        // Respuesta exitosa si el usuario es válido, excluyendo la contraseña
        socket.emit("login response", {
          success: true,
          user: { ...user, password: undefined }
        });
      }
    } catch (error) {
      console.log(error);
      socket.emit("login response", {
        success: false,
        message: error.message
      });
    }
  });




  socket.on("user update", async (data) => {
    await usersFileManager.update(data.id, data);
    const allUsers = await usersFileManager.readAll();
    socket.emit("update user", allUsers);
  });

  socket.on("user delete", async (id) => {
    await usersFileManager.destroy(id);
    const allUsers = await usersFileManager.readAll();
    socket.emit("update user", allUsers);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });


};

export default socketCb;

  