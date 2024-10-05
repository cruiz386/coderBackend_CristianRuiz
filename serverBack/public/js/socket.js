/* document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Manejador de eventos para registrar un nuevo usuario
  document.querySelector("#register")?.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.querySelector("#role").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const photo = document.querySelector("#photo").value;
    const userData = { name, email, password, photo };

    socket.emit("new user", userData);
  });

  // Manejar la actualización de la lista de usuarios
  socket.on("update user", (data) => {
    const usersHtml = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Name</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Email</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Photo</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(user => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.email}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">
              <img src="${user.photo}" alt="${user.name}'s photo" style="width: 50px; height: 50px; border-radius: 50%;">
            </td>
          </tr>`).join("")}
      </tbody>
    </table>`;

    document.querySelector("#update").innerHTML = usersHtml;
  });

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

 */

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Manejador para registro de nuevo usuario
  document.querySelector("#register")?.addEventListener("click", (event) => {
    event.preventDefault();
    const userData = {
      name: document.querySelector("#role").value,
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
      photo: document.querySelector("#photo").value
    };
    socket.emit("new user", userData);
  });

  // Manejar respuesta de actualización de usuarios
  socket.on("update user", (data) => {
    const usersHtml = data.map(user => `
      <tr>
        <td>${user.name}</td> 
        <td>${user.email}</td>
        <td><img src="${user.photo}" alt="${user.email}'s photo" style="width: 50px; height: 50px; border-radius: 50%;"></td>
      </tr>`).join("");
    document.querySelector("#update").innerHTML = `<table><tbody>${usersHtml}</tbody></table>`;
  }); 
 
  // Manejar eventos de login
  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const userData = {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value
    };
    socket.emit("user login", userData);
  });
 
  // Manejar respuesta de login
  socket.on("login response", (data) => {
    if (data.success) {
      window.location.href = "/"; // Redirigir al inicio
    } else {
      alert(data.message); // Mostrar mensaje de error
    }
  });

  // Manejar la lista de productos
  const handleProductUpdates = (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map(product => `
      <tr id="product-${product.id}">
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td><img src="${product.photo}" alt="${product.title}" class="img-thumbnail" style="max-width: 100px;"></td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <button class="delete-product" data-id="${product.id}">Delete</button>
          <button class="update-product" data-id="${product.id}">Update</button>
        </td>
      </tr>`).join("");
  };

  socket.on("update products", handleProductUpdates);
  socket.on("update filtered products", handleProductUpdates);

  // Eventos de eliminación y actualización de productos
  document.getElementById("product-list")?.addEventListener("click", (event) => {
    const productId = event.target.dataset.id;
    if (event.target.classList.contains("delete-product")) {
      socket.emit("delete product", productId);
    } else if (event.target.classList.contains("update-product")) {
      const productRow = document.getElementById(`product-${productId}`);
      document.getElementById("update-id").value = productId;
      document.getElementById("update-title").value = productRow.cells[1].innerText;
      document.getElementById("update-photo").value = productRow.cells[2].innerText;
      document.getElementById("update-category").value = productRow.cells[3].innerText;
      document.getElementById("update-price").value = productRow.cells[4].innerText;
      document.getElementById("update-stock").value = productRow.cells[5].innerText;
      document.getElementById("update-product-form").style.display = "block";
    }
  });

  // Enviar formulario de actualización de producto
  document.getElementById("update-product-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const productData = {
      id: document.getElementById("update-id").value,
      title: document.getElementById("update-title").value,
      photo: document.getElementById("update-photo").value,
      category: document.getElementById("update-category").value,
      price: document.getElementById("update-price").value,
      stock: document.getElementById("update-stock").value
    };
    socket.emit("update product", productData);
    event.target.reset();
    event.target.style.display = "none";
  });

  // Enviar formulario de agregar producto
  document.getElementById("add-product-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const newProductData = {
      title: document.getElementById("title").value,
      photo: document.getElementById("photo").value,
      category: document.getElementById("category").value,
      price: document.getElementById("price").value,
      stock: document.getElementById("stock").value
    };
    socket.emit("add product", newProductData);
    event.target.reset();
  });

  // Filtro de productos
  document.getElementById("filter-button")?.addEventListener("click", () => {
    const pid = document.getElementById("search-pid").value;
    const category = document.getElementById("search-category").value;
    socket.emit("search products", { pid, category });
  });
});
  