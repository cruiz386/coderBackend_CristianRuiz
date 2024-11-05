
// socket front end
document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Recuperar usuario del localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  // Actualizar el navbar según el estado del usuario
  if (user) {
    actualizarNavbar(true);

  } else {
    actualizarNavbar(false);

  }

  // Función para redirigir al home
  function redirectToHome() {
    window.location.href = "/home";
  }


  function actualizarNavbar(isLoggedIn = false) {
    const navbarLinks = document.querySelector(".navbar-nav");

    if (user && isLoggedIn) {
      navbarLinks.innerHTML = `
        <a class="nav-link active" href="/home">Home</a>
        <a class="nav-link" href="/products">All products</a>
        <a class="nav-link" href="/products/admin">Admin Products</a>
        <a class="nav-link" href="/cart/${user._id}">Cart</a>
        <a class="nav-link" href="/users/profile/${user._id}">Profile</a>
        <a class="nav-link" id="logout" href="/users/Logout">Logout</a>
        <img src="${user.photo || '/default-profile.png'}" alt="foto_user" class="img-thumbnail" style="max-width: 50px; height: 50px;">
      `;


      document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("user");
        redirectToHome();
      });
    } else {
      navbarLinks.innerHTML = `
        <a class="nav-link active" href="/home">Home</a>
        <a class="nav-link" href="/users/register">Register</a>
        <a class="nav-link" href="/users/login">Login</a>
      `;
    }
  }


  ///////////////
  //  USERS  //
  ///////////////

  // Manejar eventos de login
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
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
  }

  // Cerrar sesión
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      socket.emit("update user status", { userId, isOnline: false });
      localStorage.removeItem("user");
      redirectToHome();
    });
  }

  // Manejador de eventos para registrar un nuevo usuario
  const registerForm = document.querySelector("#registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
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
  }

  ///////////////
  //  PRODUCTS  //
  ///////////////

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

  // Escuchar actualización de productos
  socket.on("update products", handleProductUpdates);
  socket.on("update filtered products", handleProductUpdates);

  // Delegación de eventos para eliminar y actualizar productos
  document.getElementById("product-list")?.addEventListener("click", (event) => {
    const productId = event.target.dataset.id;
    if (event.target.classList.contains("delete-product")) {
      socket.emit("delete product", productId);
    } else if (event.target.classList.contains("update-product")) {
      const productRow = document.getElementById(`product-${productId}`);
      document.getElementById("update-id").value = productId;
      document.getElementById("update-title").value = productRow.cells[1].innerText;
      document.getElementById("update-photo").value = productRow.cells[2].querySelector("img").src;
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




  ///////////////
  //  CART  //
  ///////////////

  // Manejar la respuesta al actualizar el carrito
  socket.on("update cart", (updatedCart) => {
    window.location.reload();
  });

  // Delegación de eventos para eliminar elementos del carrito
  const removeCartButtons = document.querySelectorAll(".remove-cart-item");
  removeCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;

      console.log(`productId: ${productId} -  userId: ${userId}`);

      socket.emit("remove cart item", { userId, productId }, (response) => {
        if (response.error) {
          console.error("Error al eliminar del carrito:", response.error);
        } else {
          console.log("Producto eliminado del carrito:", response);
        }
      });

    });
  });



  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;

      console.log(`productId: ${productId} -  userId: ${userId}`);

      socket.emit("add to cart", { userId, productId }, (response) => {
        if (response.error) {
          console.error("Error al agregar al carrito:", response.error);
        } else {
          console.log("Producto agregado al carrito:", response);
        }
      });
    });
  });



  document.querySelectorAll("button[data-action]").forEach(button => {
    button.addEventListener("click", (event) => {
      const productId = event.currentTarget.dataset.id;
      const action = event.currentTarget.dataset.action;
      const quantityInput = event.currentTarget.parentElement.querySelector(".quantity-input");
      let quantity = parseInt(quantityInput.value);

      if (action === "increase") {
        quantity++;
      } else if (action === "decrease" && quantity > 1) {
        quantity--;
      }

      quantityInput.value = quantity;

      socket.emit("update cart item", { productId, quantity });
    });
  });





  document.getElementById("finish-purchase")?.addEventListener("click", () => {
    socket.emit("finish purchase", { userId });
  });


  socket.on("finish purchase response", (response) => {
    if (response.success) {
      const { products, totalPrice } = response;
      const msg = `Purchase successful! You have purchased: ${products.map(product => product.title).join(", ")}\nfor a total of $${totalPrice}`;
      const alertContainer = document.getElementById("finish-purchase-alert");


      const alert = document.createElement("div");
      alert.className = "alert alert-success text-center";
      alert.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 400px; border-radius: 15px;";

      const message = document.createElement("p");
      message.className = "mb-0";
      message.style.fontSize = "18px";
      message.textContent = msg;


      const okButton = document.createElement("button");
      okButton.className = "btn btn-success mt-3";
      okButton.textContent = "OK";
      okButton.style.width = "50%";
      okButton.style.borderRadius = "10px";


      okButton.addEventListener("click", () => {
        window.location.href = "/home";
      });


      alertContainer.innerHTML = "";
      alert.appendChild(message);
      alert.appendChild(okButton);
      alertContainer.appendChild(alert);

    } else {

      Swal.fire({
        title: "Error",
        text: `Error during purchase: ${response.message}`,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  });


  document.getElementById("cancel-purchase")?.addEventListener("click", () => {
    socket.emit("cancel purchase", { userId });
  });


  socket.on("cancel purchase response", (response) => {
    if (response.success) {
      const msg = "Purchase has been successfully canceled.";
      const alertContainer = document.getElementById("cancel-purchase-alert");


      const alert = document.createElement("div");
      alert.className = "alert alert-warning text-center";
      alert.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 400px; border-radius: 15px;";


      const message = document.createElement("p");
      message.className = "mb-0";
      message.style.fontSize = "18px";
      message.textContent = msg;

      const okButton = document.createElement("button");
      okButton.className = "btn btn-warning mt-3";
      okButton.textContent = "OK";
      okButton.style.width = "50%";
      okButton.style.borderRadius = "10px";


      okButton.addEventListener("click", () => {
        window.location.href = "/home";
      });

      alertContainer.innerHTML = "";
      alert.appendChild(message);
      alert.appendChild(okButton);
      alertContainer.appendChild(alert);

    } else {

      Swal.fire({
        title: "Error",
        text: `Error canceling purchase: ${response.message}`,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  });


});
