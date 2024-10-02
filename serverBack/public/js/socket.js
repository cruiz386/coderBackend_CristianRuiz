document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Manejar el evento de eliminación de producto
  document.getElementById("product-list")?.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-product")) {
      event.preventDefault();
      const productId = event.target.dataset.id;

      // Emitir evento para eliminar producto
      socket.emit("delete product", productId);
    } else if (event.target.classList.contains("update-product")) {
      event.preventDefault();
      const productId = event.target.dataset.id;

      // Obtener los datos del producto y rellenar el formulario de actualización
      const productRow = document.getElementById(`product-${productId}`);
      const title = productRow.cells[1].innerText;
      const photo = productRow.cells[2].innerText;
      const category = productRow.cells[3].innerText;
      const price = productRow.cells[4].innerText;
      const stock = productRow.cells[5].innerText;

      // Rellenar el formulario de actualización
      document.getElementById("update-id").value = productId;
      document.getElementById("update-title").value = title;
      document.getElementById("update-photo").value = photo;
      document.getElementById("update-category").value = category;
      document.getElementById("update-price").value = price;
      document.getElementById("update-stock").value = stock;
      document.getElementById("update-product-form").style.display = "block"; // Mostrar el formulario
    }
  });

  // Manejar el envío del formulario para actualizar un producto
  const updateProductForm = document.getElementById("update-product-form");
  if (updateProductForm) {
    updateProductForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const productData = {
        id: document.getElementById("update-id").value,
        title: document.getElementById("update-title").value,
        photo: document.getElementById("update-photo").value,
        category: document.getElementById("update-category").value,
        price: document.getElementById("update-price").value,
        stock: document.getElementById("update-stock").value
      };

      // Emitir evento para actualizar producto
      socket.emit("update product", productData);
      updateProductForm.reset(); // Resetear el formulario
      updateProductForm.style.display = "none"; // Ocultar el formulario
    });
  }

  // Manejar el envío del formulario para agregar un producto
  const addProductForm = document.getElementById("add-product-form");
  if (addProductForm) {
    addProductForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const newProductData = {
        title: document.getElementById("title").value,
        photo: document.getElementById("photo").value,
        category: document.getElementById("category").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value
      };

      // Emitir evento para agregar producto
      socket.emit("add product", newProductData);
      addProductForm.reset(); // Resetear el formulario
    });
  }

  // Manejar el filtro de productos
  document.getElementById("filter-button").addEventListener("click", () => {
    const pid = document.getElementById("search-pid").value;
    const category = document.getElementById("search-category").value;

    // Emitir evento para buscar productos
    socket.emit("search products", { pid, category });
  });

  // Escuchar el evento para actualizar la lista de productos
  socket.on("update products", (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Limpiar la lista existente

    products.forEach(product => {
      const row = document.createElement("tr");
      row.id = `product-${product.id}`;
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td><img src="${product.photo}" alt="${product.title}" class="img-thumbnail" style="max-width: 100px;"></td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <a href="#" class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Delete</a>
          <a href="#" class="btn btn-warning btn-sm update-product" data-id="${product.id}">Update</a>
        </td>
      `;
      productList.appendChild(row);
    });
  });

  // Escuchar el evento para actualizar la lista filtrada de productos
  socket.on("update filtered products", (filteredProducts) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Limpiar la lista existente

    filteredProducts.forEach(product => {
      const row = document.createElement("tr");
      row.id = `product-${product.id}`;
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td><img src="${product.photo}" alt="${product.title}" class="img-thumbnail" style="max-width: 100px;"></td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <a href="#" class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Delete</a>
          <a href="#" class="btn btn-warning btn-sm update-product" data-id="${product.id}">Update</a>
        </td>
      `;
      productList.appendChild(row);
    });
  });
});
