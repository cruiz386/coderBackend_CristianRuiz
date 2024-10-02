import productsFileManager from "../data/files/products.fileManager.js"; // Asegúrate de que la ruta sea correcta
import usersFileManager from "../data/files/users.fileManager.js"; // Asegúrate de que la ruta sea correcta

const socketCb = (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("new user", async (data) => {
    await usersFileManager.create(data);
    const allUsers = await usersFileManager.readAll();
    socket.emit("update user", allUsers);
  });

  
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
        product.id.toString() === pid // Asegúrate de comparar correctamente el ID
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
    socket.emit("update products", allProducts); // Notifica a todos los clientes sobre la actualización
  });
};

export default socketCb;
