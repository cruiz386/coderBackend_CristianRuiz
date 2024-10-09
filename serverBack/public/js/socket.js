//socket front end 

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Recuperar usuario del localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Actualizar el navbar según el estado del usuario
  if (user) {
    actualizarNavbar(true);
  } else {
    actualizarNavbar(false);
  }

  // Función para redirigir a la página de administración de productos
  function redirectToAdminProducts() {
    window.location.href = "/products";
  }

  function redirectToHome() {
    window.location.href = "/";
  }

  // Función para actualizar el navbar
  function actualizarNavbar(isLoggedIn = false) {
    const navbarLinks = document.querySelector(".navbar-nav");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && isLoggedIn) {
        navbarLinks.innerHTML = `
            <a class="nav-link active" href="/">Home</a>
            <a class="nav-link" href="/products">All products</a>
            <a class="nav-link" href="/products/admin">Admin Products</a>
            <a class="nav-link" href="/users/profile/${user._id}">Profile</a>
            <a class="nav-link" id="logout" href="#">Logout</a>
            <img src="${user.photo || '/default-profile.png'}" alt="foto_user" class="img-thumbnail" style="max-width: 50px; height: 50px;">
        `;

        // Evento para el logout
        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.reload();
        });
    } else {
        navbarLinks.innerHTML = `
            <a class="nav-link" href="/users/register">Register</a>
            <a class="nav-link" href="/users/login">Login</a>
        `;
    }
}



  // Manejar eventos de login
  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
  
    try {
      socket.emit("user login", { email, password });
  
      socket.on("login response", (data) => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("User logged in:", data.user);
          
          actualizarNavbar(true);
          window.location.href = "/products";
        } else {
          alert("Credenciales incorrectas");
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      alert("There was an error during login. Please try again.");
    }
  });
  

  // Cerrar sesión
  document.getElementById("logout")?.addEventListener("click", () => {

    socket.emit("update user status", { userId: user.id, isOnline: false });
    localStorage.removeItem("user");
    window.location.reload(); // Recargar la página después del logout
    redirectToHome();
  });

  socket.on("user logout", () => {
    localStorage.removeItem("user");

    window.location.reload(); // Recargar la página después del logout
  });

  // Manejador de eventos para registrar un nuevo usuario
  document.querySelector("#registerForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const role = document.querySelector("#role").value || 0; // Valor por defecto
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const photo = document.querySelector("#photo").value || "https://i.ytimg.com/vi/bb5nPL38ptk/maxresdefault.jpg"; // Valor por defecto


    // Validar campos obligatorios
    let isValid = true;

    // Validar email
    if (!email) {
      isValid = false;
      document.querySelector("#email").classList.add("is-invalid");
    } else {
      document.querySelector("#email").classList.remove("is-invalid");
    }

    // Validar contraseña
    if (!password || password.length < 6) {
      isValid = false;
      document.querySelector("#password").classList.add("is-invalid");
    } else {
      document.querySelector("#password").classList.remove("is-invalid");
    }

    // Validar foto
    if (!photo) {
      isValid = false;
      document.querySelector("#photo").classList.add("is-invalid");
    } else {
      document.querySelector("#photo").classList.remove("is-invalid");
    }

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    const userData = { role, email, password, photo };
    redirectToHome();
    socket.emit("new user", userData);
  });





  // Manejar eventos relacionados con los productos (agregar, actualizar, eliminar)
  const handleProductUpdates = (products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map(product => `
      <tr id="product-${product._id}">
        <td>${product._id}</td>
        <td>${product.title}</td>
        <td><img src="${product.photo}" alt="${product.title}" class="img-thumbnail" style="max-width: 100px;"></td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn btn-danger delete-product" data-id="${product._id}">Delete</button>
          <button class="btn btn-warning update-product" data-id="${product._id}">Update</button>
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
