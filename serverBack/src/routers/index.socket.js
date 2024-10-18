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
        socket.userId = user._id;
        socket.emit("login response", {
          success: true,
          user: user,
        });


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


  socket.on("add to cart", async ({ userId, productId }) => {
    try {
      console.log(`User ID: ${userId}, Product ID: ${productId}`);
      const cartData = { "user_id": userId, "product_id": productId, quantity: 1 };
      console.log(cartData);

      await cartManager.create(cartData);

      const updatedCart = await cartManager.readCartsByUserId(userId);

    } catch (error) {
      socket.emit("cart error", { message: error.message || "Error al agregar producto al carrito." });
    }
  });

  socket.on("remove cart item", async ({ userId, productId }) => {
    try {
      console.log(`User ID: ${userId}, Product ID: ${productId}`);
      const cartData = { user_id: userId, product_id: productId };
      await cartManager.destroy(userId, productId);
      const updatedCart = await cartManager.readCartsByUserId(userId);
      socket.emit("update cart", updatedCart);

    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      socket.emit("cart error", { message: "Error al eliminar producto del carrito." });
    }
  });

  socket.on("update cart quantity", async ({ userId, productId, quantity }) => {
    try {
      if (quantity <= 0) throw new Error("Cantidad inválida");
      await cartManager.update(userId, productId, quantity);
      const updatedCart = await cartManager.readCartsByUserId(userId);
      socket.emit("update cart", updatedCart);
    } catch (error) {
      socket.emit("cart error", { message: "Error al actualizar cantidad." });
    }
  });

  socket.on("update cart item", async ({ productId, quantity }) => {
    try {

      await cartManager.updateItemQuantity(productId, quantity);

      socket.emit("cart item updated", { success: true, productId, quantity });
    } catch (error) {
      console.error("Error updating cart item:", error);
      socket.emit("cart item updated", { success: false, message: error.message });
    }
  });


  socket.on("finish purchase", async ({ userId }) => {
    try {
      const totalPrice = await cartManager.calculateTotal(userId);
      const products = await cartManager.readCartsByUserId(userId);

      socket.emit("finish purchase response", { success: true, products, totalPrice, userId });
      await cartManager.destroyAll(userId);

    } catch (error) {
      console.error("Error during the finish purchase:", error);
      socket.emit("finish purchase response", { success: false, message: error.message });
    }
  });


  socket.on("cancel purchase", async ({ userId }) => {
    try {
      await cartManager.destroyAll(userId);
      socket.emit("cancel purchase response", { success: true });
    } catch (error) {
      socket.emit("cancel purchase response", { success: false, message: error.message });
    }
  });





};

export default socketCb;

