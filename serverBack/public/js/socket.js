// // socket front end 
// document.addEventListener("DOMContentLoaded", () => {
//   const socket = io();

//   // Recuperar usuario del localStorage
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user ? user._id : null;


//   // Actualizar el navbar según el estado del usuario
//   if (user) {
//     actualizarNavbar(true);
//   } else {
//     actualizarNavbar(false);
//   }


//   function redirectToHome() {
//     window.location.href = "/";
//   }

//   // Función para actualizar el navbar
//   function actualizarNavbar(isLoggedIn = false) {
//     const navbarLinks = document.querySelector(".navbar-nav");

//     if (user && isLoggedIn) {
//       navbarLinks.innerHTML = `
//         <a class="nav-link active" href="/">Home</a>
//         <a class="nav-link" href="/products">All products</a>
//         <a class="nav-link" href="/products/admin">Admin Products</a>
//         <a class="nav-link" href="/cart/${user._id}">Cart</a>

//         <a class="nav-link" href="/users/profile/${user._id}">Profile</a>
//         <a class="nav-link" id="logout" href="/users/Logout">Logout</a>
//         <img src="${user.photo || '/default-profile.png'}" alt="foto_user" class="img-thumbnail" style="max-width: 50px; height: 50px;">
//       `;

//       document.getElementById("logout").addEventListener("click", () => {
//         localStorage.removeItem("user");
//         redirectToHome();
//       });
//     } else {
//       navbarLinks.innerHTML = `
//         <a class="nav-link active" href="/">Home</a>
//         <a class="nav-link" href="/products">All products</a>
//         <a class="nav-link" href="/users/login">Login</a>
//       `;
//     }
//   }



//   ///////////////
//   //  USERS //
//   ///////////////

//   // Manejar eventos de login
//   document.querySelector("#login-form")?.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const email = document.querySelector("#email").value;
//     const password = document.querySelector("#password").value;

//     try {
//       socket.emit("user login", { email, password });

//       socket.on("login response", (data) => {
//         if (data.success) {
//           localStorage.setItem("user", JSON.stringify(data.user));
//           console.log("User logged in:", data.user);

//           actualizarNavbar(true);
//           window.location.href = "/products";
//         } else {
//           alert("Credenciales incorrectas");
//         }
//       });
//     } catch (error) {
//       console.error("Error during login:", error);
//       alert("There was an error during login. Please try again.");
//     }
//   });


//   // Cerrar sesión
//   document.getElementById("logout")?.addEventListener("click", () => {

//     socket.emit("update user status", { userId, isOnline: false });
//     localStorage.removeItem("user");

//     redirectToHome();
//   });

//   socket.on("user logout", () => {
//     localStorage.removeItem("user");
//   });

//   // Manejador de eventos para registrar un nuevo usuario
//   document.querySelector("#registerForm")?.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const role = document.querySelector("#role").value || 0; // Valor por defecto
//     const email = document.querySelector("#email").value;
//     const password = document.querySelector("#password").value;
//     const photo = document.querySelector("#photo").value || "https://i.ytimg.com/vi/bb5nPL38ptk/maxresdefault.jpg"; // Valor por defecto


//     // Validar campos obligatorios
//     let isValid = true;

//     // Validar email
//     if (!email) {
//       isValid = false;
//       document.querySelector("#email").classList.add("is-invalid");
//     } else {
//       document.querySelector("#email").classList.remove("is-invalid");
//     }

//     // Validar contraseña
//     if (!password || password.length < 6) {
//       isValid = false;
//       document.querySelector("#password").classList.add("is-invalid");
//     } else {
//       document.querySelector("#password").classList.remove("is-invalid");
//     }

//     // Validar foto
//     if (!photo) {
//       isValid = false;
//       document.querySelector("#photo").classList.add("is-invalid");
//     } else {
//       document.querySelector("#photo").classList.remove("is-invalid");
//     }

//     if (!isValid) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const userData = { role, email, password, photo };
//     redirectToHome();
//     socket.emit("new user", userData);
//   });



//   ///////////////
//   //  PRODUCTS //
//   ///////////////



//   // Manejar eventos relacionados con los productos (agregar, actualizar, eliminar)
//   const handleProductUpdates = (products) => {
//     const productList = document.getElementById("product-list");
//     productList.innerHTML = products.map(product => `
//       <tr id="product-${product._id}">
//         <td>${product._id}</td>
//         <td>${product.title}</td>
//         <td><img src="${product.photo}" alt="${product.title}" class="img-thumbnail" style="max-width: 100px;"></td>
//         <td>${product.category}</td>
//         <td>${product.price}</td>
//         <td>${product.stock}</td>
//         <td>
//           <button class="btn btn-danger delete-product" data-id="${product._id}">Delete</button>
//           <button class="btn btn-warning update-product" data-id="${product._id}">Update</button>
//         </td>
//       </tr>`).join("");
//   };


//   socket.on("update products", handleProductUpdates);
//   socket.on("update filtered products", handleProductUpdates);

//   // Eventos de eliminación y actualización de productos
//   document.getElementById("product-list")?.addEventListener("click", (event) => {
//     const productId = event.target.dataset.id;
//     if (event.target.classList.contains("delete-product")) {
//       socket.emit("delete product", productId);
//     } else if (event.target.classList.contains("update-product")) {
//       const productRow = document.getElementById(`product-${productId}`);
//       document.getElementById("update-id").value = productId;
//       document.getElementById("update-title").value = productRow.cells[1].innerText;
//       // document.getElementById("update-photo").value = productRow.cells[2].innerText;
//       document.getElementById("update-photo").value = productRow.cells[2].querySelector("img").src;
//       document.getElementById("update-category").value = productRow.cells[3].innerText;
//       document.getElementById("update-price").value = productRow.cells[4].innerText;
//       document.getElementById("update-stock").value = productRow.cells[5].innerText;
//       document.getElementById("update-product-form").style.display = "block";
//     }
//   });

//   // Enviar formulario de actualización de producto
//   document.getElementById("update-product-form")?.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const productData = {
//       id: document.getElementById("update-id").value,
//       title: document.getElementById("update-title").value,
//       photo: document.getElementById("update-photo").value,
//       category: document.getElementById("update-category").value,
//       price: document.getElementById("update-price").value,
//       stock: document.getElementById("update-stock").value
//     };
//     socket.emit("update product", productData);
//     event.target.reset();
//     event.target.style.display = "none";
//   });

//   // Enviar formulario de agregar producto
//   document.getElementById("add-product-form")?.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const newProductData = {
//       title: document.getElementById("title").value,
//       photo: document.getElementById("photo").value,
//       category: document.getElementById("category").value,
//       price: document.getElementById("price").value,
//       stock: document.getElementById("stock").value
//     };
//     socket.emit("add product", newProductData);
//     event.target.reset();
//   });

//   // Filtro de productos
//   document.getElementById("filter-button")?.addEventListener("click", () => {
//     const pid = document.getElementById("search-pid").value;
//     const category = document.getElementById("search-category").value;
//     socket.emit("search products", { pid, category });
//   });

//   // Conectar el evento de búsqueda de productos
//   document.getElementById("searchButton").addEventListener("click", () => {
//     const pid = document.getElementById("productId").value;
//     const category = document.getElementById("category").value;

//     socket.emit("search products", { pid, category });
//   });

//   // Escuchar los productos actualizados
//   socket.on("update products", (products) => {
//     // Aquí puedes actualizar la vista con la lista de productos
//     console.log("Products updated:", products);
//   });

//   // Escuchar productos filtrados
//   socket.on("update filtered products", (filteredProducts) => {
//     // Aquí puedes actualizar la vista con la lista filtrada
//     console.log("Filtered products:", filteredProducts);
//   });



//   ///////////////
//   //  CARTS //
//   ///////////////

//   /*       // Manejador para eliminar productos del carrito
//         document.querySelectorAll('.delete-cart-btn').forEach(button => {
//           button.addEventListener('click', (event) => {
//               const productId = event.target.dataset.id;
//               socket.emit("remove product from cart", { userId, productId });
//           });
//       });

//       // Manejador para cambiar la cantidad de productos en el carrito
//       document.querySelectorAll('.change-quantity').forEach(button => {
//           button.addEventListener('click', (event) => {
//               const productId = event.target.dataset.id;
//               const action = event.target.dataset.action;
//               const quantityInput = document.querySelector(`[data-id="${productId}"]`).closest('.card-body').querySelector('.quantity-input');

//               let newQuantity = parseInt(quantityInput.value);
//               if (action === "increase") {
//                   newQuantity++;
//               } else if (action === "decrease" && newQuantity > 1) {
//                   newQuantity--;
//               }
//               quantityInput.value = newQuantity;

//               socket.emit("update cart quantity", { userId, productId, quantity: newQuantity });
//           });
//       });

//       // Manejador para agregar productos al carrito
//       document.querySelectorAll('.add-to-cart').forEach(button => {
//           button.addEventListener('click', (event) => {
//               const productId = event.target.dataset.id;
//               // Aquí puedes especificar la cantidad que deseas agregar
//               const quantity = 1; // Cambia esto si deseas permitir al usuario especificar una cantidad
//               socket.emit("add to cart",  { userId, productId, quantity });
//           });
//       });
//       // Recibir actualizaciones de carrito desde el backend
//       socket.on("update cart", async (updatedCart) => {
//           console.log("Carrito actualizado:", updatedCart);
//           const cartHtml = updatedCart.map(cart => {
//               return `<tr>
//                   <td>${cart.product_id.title}</td>
//                   <td>${cart.quantity}</td>
//                   <td>
//                       <button class="btn btn-danger delete-cart-btn" data-id="${cart.product_id._id}">Eliminar</button>
//                       <button class="btn btn-secondary change-quantity" data-id="${cart.product_id._id}" data-action="increase">+</button>
//                       <input type="number" class="quantity-input" value="${cart.quantity}" />
//                       <button class="btn btn-secondary change-quantity" data-id="${cart.product_id._id}" data-action="decrease">-</button>
//                   </td>
//               </tr>`;
//           }).join("");
//           document.getElementById("cart-table").innerHTML = cartHtml;
//       }); */


//   // Función para inicializar eventos después de actualizar el carrito

//   document.querySelectorAll('.delete-cart-btn').forEach(button => {
//     button.addEventListener('click', (event) => {
//       const productId = event.target.dataset.id;
//       const userId = '{{userId}}'; // Obtener el userId desde el contexto de Handlebars
//       socket.emit("remove product from cart", { userId, productId });
//     });
//   });

//     // Manejador para cambiar la cantidad de productos en el carrito
//     document.querySelectorAll('.change-quantity').forEach(button => {
//       button.addEventListener('click', (event) => {
//         const productId = event.target.dataset.id;
//         const action = event.target.dataset.action;
//         const quantityInput = document.querySelector(`[data-id="${productId}"]`).closest('.card-body').querySelector('.quantity-input');

//         let newQuantity = parseInt(quantityInput.value);
//         if (action === "increase") {
//           newQuantity++;
//         } else if (action === "decrease" && newQuantity > 1) {
//           newQuantity--;
//         }
//         quantityInput.value = newQuantity;

//         socket.emit("update cart quantity", { userId, productId, quantity: newQuantity });
//       });
//     });


//   // Manejador para agregar productos al carrito
//   document.querySelectorAll('.add-to-cart').forEach(button => {
//     button.addEventListener('click', (event) => {
//       const productId = event.target.dataset.id;
//       const quantity = 1; // Puedes cambiar esta cantidad si es necesario
//       socket.emit("add to cart", { userId, productId, quantity });
//     });
//   });

//   // Recibir actualizaciones de carrito desde el backend
//   socket.on("update cart", (updatedCart) => {
//     console.log("Carrito actualizado:", updatedCart);

//     const cartHtml = updatedCart.map(cart => {
//       return `<tr>
//       <td>${cart.product_id.title}</td>
//       <td>${cart.quantity}</td>
//       <td>
//         <button class="btn btn-danger delete-cart-btn" data-id="${cart.product_id._id}">Eliminar</button>
//         <button class="btn btn-secondary change-quantity" data-id="${cart.product_id._id}" data-action="increase">+</button>
//         <input type="number" class="quantity-input" value="${cart.quantity}" />
//         <button class="btn btn-secondary change-quantity" data-id="${cart.product_id._id}" data-action="decrease">-</button>
//       </td>
//     </tr>`;
//     }).join("");
//     document.getElementById("cart-table").innerHTML = cartHtml;



//   });

//   // Manejo de errores desde el servidor
//   socket.on("cart error", (error) => {
//     alert(error.message);
//   });





// });

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
    window.location.href = "/";
  }

  // Función para actualizar el navbar
  function actualizarNavbar(isLoggedIn = false) {
    const navbarLinks = document.querySelector(".navbar-nav");

    if (user && isLoggedIn) {
      navbarLinks.innerHTML = `
        <a class="nav-link active" href="/">Home</a>
        <a class="nav-link" href="/products">All products</a>
        <a class="nav-link" href="/products/admin">Admin Products</a>
        <a class="nav-link" href="/cart/${user._id}">Cart</a>
        <a class="nav-link" href="/users/profile/${user._id}">Profile</a>
        <a class="nav-link" id="logout" href="/users/Logout">Logout</a>
        <img src="${user.photo || '/default-profile.png'}" alt="foto_user" class="img-thumbnail" style="max-width: 50px; height: 50px;">
      `;

      // Agregar event listener al botón de logout
      document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("user");
        redirectToHome();
      });
    } else {
      navbarLinks.innerHTML = `
        <a class="nav-link active" href="/">Home</a>
        <a class="nav-link" href="/products">All products</a>
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

 /*  // Cargar el carrito del usuario
  if (userId) {
    socket.emit("get cart", userId);
  } */


  // Manejar la respuesta al actualizar el carrito
  socket.on("update cart", ( updatedCart) => {
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






  // Agregar producto al carrito
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




  // Confirmar la compra
  document.getElementById("checkout")?.addEventListener("click", () => {
    socket.emit("checkout", { userId });
  });




  // Manejar respuesta de confirmación de compra
  socket.on("checkout response", (response) => {
    if (response.success) {
      alert("Purchase successful!");
      // Opcionalmente redirigir a la página de perfil o de compras
      window.location.href = `/users/profile/${userId}`;
    } else {
      alert("Error during purchase: " + response.message);
    }
  });
});
