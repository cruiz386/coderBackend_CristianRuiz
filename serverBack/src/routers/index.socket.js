/* import productsFileManager from "../data/files/products.fileManager.js"; // Asegúrate de que la ruta sea correcta
import usersFileManager from "../data/files/users.fileManager.js"; // Asegúrate de que la ruta sea correcta

const socketCb = (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("add product", async (productData) => {
    await productsFileManager.create(productData);
    const allProducts = await productsFileManager.readAll();
    socket.emit("update products", allProducts);
  });

  socket.on("delete product", async (productId) => {
    await productsFileManager.destroy(productId);
    const allProducts = await productsFileManager.readAll();
    socket.emit("update products", allProducts);
  });

  socket.on("search products", async ({ pid, category }) => {
    const allProducts = await productsFileManager.readAll();
    let filteredProducts = allProducts;

    if (pid) {
      filteredProducts = filteredProducts.filter(product =>
        product.id.toString() === pid
      );
    }
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    socket.emit("update filtered products", filteredProducts);
  });

  socket.on("update product", async (productData) => {
    await productsFileManager.update(productData.id, productData);
    const allProducts = await productsFileManager.readAll();
    socket.emit("update products", allProducts);
  });

  socket.on("new user", async (data) => {
    await usersFileManager.create(data);
    const allUsers = await usersFileManager.readAll();
    socket.emit("update user", allUsers);
  });

  socket.on("user login", async (data) => {
    const user = await usersFileManager.findUser(data.mail, data.password);
    if (user) {
      socket.emit("login response", { success: true, redirectUrl: "/" });
    } else {
      socket.emit("login response", { success: false, message: "Invalid username" });
    }
  });

  socket.on("login response", (data) => {
    if (data.success) {
      window.location.href = data.redirectUrl;
    } else {
      alert(data.message);
    }
  });

  socket.on("user authenticated", (user) => {
    // Actualizar la barra de navegación
    if (user) {
      document.querySelector(".navbar-nav").innerHTML = `
            <a class="nav-link active" href="/">Home</a>
            <a class="nav-link" href="/products/admin">Admin Products</a>
            <a class="nav-link" href="/users/profile/${user.id}">Profile</a>
            <a class="nav-link" href="/users/logout">Logout</a>
        `;
    } else {
      document.querySelector(".navbar-nav").innerHTML = `
            <a class="nav-link" href="/users/register">Register</a>
            <a class="nav-link" href="/users/login">Login</a>
        `;
    }
  });
};

export default socketCb;

 */

import productsFileManager from "../data/files/products.fileManager.js";
import usersFileManager from "../data/files/users.fileManager.js";

const socketCb = (socket) => {
  console.log(`Client ${socket.id} connected`);

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

  // Gestión de usuarios
  socket.on("new user", async (data) => {
    await usersFileManager.create(data);
    const allUsers = await usersFileManager.readAll();
    socket.emit("update user", allUsers);
  });

  socket.on("user login", async ({ email, password }) => {
    const user = await usersFileManager.findUser(email, password);
    socket.emit("login response", {
      success: !!user,
      message: user ? "Login successful" : "Invalid username or password",
      user: user ? { ...user, password: undefined } : undefined
    });
  });

  socket.on("user authenticated", (user) => {
    // Actualizar la barra de navegación
    if (user) {
      document.querySelector(".navbar-nav").innerHTML = `
            <a class="nav-link active" href="/">Home</a>
            <a class="nav-link" href="/products/admin">Admin Products</a>
            <a class="nav-link" href="/users/profile/${user.id}">Profile</a>
            <a class="nav-link" href="/users/logout">Logout</a>
        `;
    } else {
      document.querySelector(".navbar-nav").innerHTML = `
            <a class="nav-link" href="/users/register">Register</a>
            <a class="nav-link" href="/users/login">Login</a>
        `;
    }
  });
  
};

export default socketCb;
