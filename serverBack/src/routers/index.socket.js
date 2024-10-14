/* // socket back end
import productMongoManager from "../data/mongo/managers/product.mongo.js";
import userMongoManager from "../data/mongo/managers/user.mongo.js";
import cartManager from "../data/mongo/managers/cart.mongo.js";

const socketCb = (socket) => {
  console.log(`Client ${socket.id} connected`);


  ///////////////
  //  USERS //
  ///////////////
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
        socket.userId = user._id; // Almacena el ID del usuario en el socket
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


  ///////////////
  //  PRODUCTS //
  ///////////////

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




  ///////////////
  //  CARTS //
  ///////////////

// Eliminar producto del carrito
socket.on("remove product from cart", async ({ userId, productId }) => {
  try {
    await cartManager.destroy(userId, productId);
    const updatedCart = await cartManager.readCartsByUserId(userId);
    socket.emit("update cart", updatedCart);
  } catch (error) {
    socket.emit("cart error", { message: "Error al eliminar producto del carrito." });
  }
});

// Actualizar cantidad de productos en el carrito
socket.on("update cart quantity", async ({ userId, productId, quantity }) => {
  try {
    if (quantity <= 0) throw new Error("Cantidad inválida"); // Validación de cantidad
    await cartManager.update(userId, productId, quantity);
    const updatedCart = await cartManager.readCartsByUserId(userId);
    socket.emit("update cart", updatedCart);
  } catch (error) {
    socket.emit("cart error", { message: "Error al actualizar cantidad." });
  }
});

// Agregar producto al carrito
socket.on("add to cart", async ({ userId, productId, quantity }) => {
  try {
    if (quantity <= 0) throw new Error("Cantidad inválida");
    await cartManager.create(userId, productId, quantity);
    const updatedCart = await cartManager.readCartsByUserId(userId);
    socket.emit("update cart", updatedCart);
  } catch (error) {
    socket.emit("cart error", { message: "Error al agregar producto al carrito." });
  }
});


};

export default socketCb; */


// socket back end
import productMongoManager from "../data/mongo/managers/product.mongo.js";
import userMongoManager from "../data/mongo/managers/user.mongo.js";
import cartManager from "../data/mongo/managers/cart.mongo.js";

const socketCb = (socket) => {
  console.log(`Client ${socket.id} connected`);

  ///////////////
  //  USERS //
  ///////////////
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
          message: "Invalid username or password",
        });
      } else {
        socket.userId = user._id; // Store user ID in socket
        socket.emit("login response", {
          success: true,
          user: user,
        });

        // Load cart for the user after logging in
        const cart = await cartManager.readCartsByUserId(socket.userId);
        socket.emit("load cart", cart);
      }
    } catch (error) {
      console.error(error);
      socket.emit("login response", {
        success: false,
        message: error.message,
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

  ///////////////
  //  PRODUCTS //
  ///////////////
  const emitAllProducts = async () => {
    const allProducts = await productMongoManager.readAll();
    socket.emit("update products", allProducts);
  };

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

  ///////////////
  //  CARTS //
  ///////////////

  // Agregar producto al carrito
  socket.on("add to cart", async ({ userId, productId }) => {
    try {
      console.log(`User ID: ${userId}, Product ID: ${productId}`);
      const cartData = { "user_id": userId, "product_id": productId, quantity: 1 };
      console.log(cartData);
      //cartData = {userId, productId, quantity: 1};
      await cartManager.create(cartData); // Actualizar el carrito en la base de datos
      // Leer el carrito actualizado
      const updatedCart = await cartManager.readCartsByUserId(userId);
      //socket.emit("update cart", updatedCart);
    } catch (error) {
      socket.emit("cart error", { message: error.message || "Error al agregar producto al carrito." });
    }
  });



  socket.on("remove cart item", async ({ userId, productId }) => {
    try {
        console.log(`User ID: ${userId}, Product ID: ${productId}`);
        const cartData = { user_id: userId, product_id: productId };
        await cartManager.destroy(userId, productId); // Asegúrate de pasar los parámetros correctamente.
        const updatedCart = await cartManager.readCartsByUserId(userId);
        socket.emit("update cart", updatedCart);

    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        socket.emit("cart error", { message: "Error al eliminar producto del carrito." });
    }
});


  // Actualizar cantidad de productos en el carrito
  socket.on("update cart quantity", async ({ userId, productId, quantity }) => {
    try {
      if (quantity <= 0) throw new Error("Cantidad inválida"); // Validación de cantidad
      await cartManager.update(userId, productId, quantity);
      const updatedCart = await cartManager.readCartsByUserId(userId);
      socket.emit("update cart", updatedCart);
    } catch (error) {
      socket.emit("cart error", { message: "Error al actualizar cantidad." });
    }
  });



  





  // Confirmar la compra
  socket.on("checkout", async ({ userId }) => {
    try {
      const cart = await cartManager.readCartsByUserId(userId);
      if (!cart || cart.items.length === 0) {
        throw new Error("El carrito está vacío.");
      }

      // Aquí podrías realizar la lógica para procesar el pago o cualquier otro proceso necesario

      // Limpiar el carrito después de la compra
      await cartManager.clearCart(userId);
      socket.emit("checkout response", { success: true });
    } catch (error) {
      socket.emit("checkout response", { success: false, message: error.message });
    }
  });
};

export default socketCb;

