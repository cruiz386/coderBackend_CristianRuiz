

/* async function getCart(req, res, next) {
  try {
    const { uid } = req.params;
    const cart = await cartMongoManager.getCartByUserId(uid);
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.render("cart", { products: cart.products }); // Asegúrate de que esté renderizando la vista correcta
  } catch (error) {
    return next(error);
  }
}



async function createCart(req, res, next) {
  try {
    const { uid, data } = req.body;
    const newCart = await cartMongoManager.create({ uid, products: data });
    return res.status(201).json({ message: "Cart created", newCart });
  } catch (error) {
    return next(error);
  }
}

async function addProductToCart(req, res, next) {
  try {
    const { uid, pid } = req.body;
    const cart = await cartMongoManager.readById(uid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const product = await productMongoManager.readById(pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const newCart = await cartMongoManager.update(uid, { products: [...cart.products, product] });
    return res.status(200).json({ message: "Product added to cart", newCart });
  } catch (error) {
    return next(error);
  }
}

async function removeProductFromCart(req, res, next) {
  try {
    const { uid, pid } = req.body;
    const cart = await cartMongoManager.readById(uid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const newCart = await cartMongoManager.update(uid, { products: cart.products.filter(product => product._id.toString() !== pid) });
    return res.status(200).json({ message: "Product removed from cart", newCart });
  } catch (error) {
    return next(error);
  }
}

export { getCart, createCart, addProductToCart, removeProductFromCart }; */

import cartManager from "../data/mongo/managers/cart.mongo.js";
 import Cart from "../data/mongo/models/cart.model.js";

//import productMongoManager from "../data/mongo/managers/product.mongo.js";

const create = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await cartManager.create(data);
    return res.status(201).json({ message: "Cart created", response });
  } catch (error) {
    return next(error);
  }
};

const readAll = async (req, res, next) => {
  try {
    const filter = req.query;
    const response = await cartManager.readAll(filter);
    return res.status(200).json({ message: "Carts read", response });
  } catch (error) {
    return next(error);
  }
};

const read = async (req, res, next) => {
  try {
    const { cid } = req.params; // Asegúrate de que uid es el parámetro correcto
    const response = await cartManager.read(cid);
    return res.status(200).json({ message: "Cart read", response });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { cid } = req.params;
    const cart = await cartManager.update(cid, data);
    return res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    return next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const response = await cartManager.destroy(cid);
    return res.status(200).json({ message: "Cart destroyed", response });
  } catch (error) {
    return next(error);
  }
};

async function showCart(req, res, next) {
  try {
    const { cid } = req.params;
    console.log('Cart ID:', cid); // Verificar que cid no sea undefined o null

    const response = await cartManager.read(cid); // Utiliza el método read() para obtener un solo producto con el ID especificado en el parámetro cid);
    console.log('Cart:', response);

    if (!response) {
      return res.status(404).json({ message: "Cart not found", response });
    }
    return res.render("cart", { response });

  } catch (error) {
    return next(error);
  }
}


/* async function showCartByUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId || userId === 'url') {
      return res.status(400).send('Invalid user ID');
    }

    // Obtener todos los carritos del usuario
    const carts = await cartManager.readCartsByUserId(userId);
    
    if (!carts || carts.length === 0) {
      // Si no hay carritos, mostrar un mensaje de error
      return res.render("cart", { carts: carts });
      //return res.status(404).json({ message: "No carts found for this user" });
    }

    // Usar populate para traer información de los productos
    const populatedCarts = await Cart.populate(carts, { path: 'product_id', model: 'products' });

    // Crear una nueva estructura de datos solo con las propiedades necesarias
    const cartData = await Promise.all(populatedCarts.map(async cart => {
      // product_id debe estar poblado
      const product = cart.product_id || await productMongoManager.readById(cart.product_id);

      return {
        userId: cart.user_id,
        productDetails: {
          _id: product._id,
          title: product.title,
          price: product.price,
          photo: product.photo,
        },
        quantity: cart.quantity,
        state: cart.state
      };
    }));

    // Renderiza la vista con los datos
    return res.render("cart", { carts: cartData });
  } catch (error) {
    return next(error);
  }
} */

  async function showCartByUser(req, res, next) {
    try {
      const { userId } = req.params;
  
      if (!userId || userId === 'url') {
        return res.status(400).send('Invalid user ID');
      }
  
      // Obtener todos los carritos del usuario
      const carts = await cartManager.readCartsByUserId(userId);
  
      if (!carts || carts.length === 0) {
        // Si no hay carritos, renderiza con una lista vacía
        return res.render("cart", { carts: [], userId });
      }
  
      // Usar populate para traer información de los productos
      const populatedCarts = await Cart.populate(carts, { path: 'product_id', model: 'products' });
  
      // Crear una nueva estructura de datos solo con las propiedades necesarias
      const cartData = populatedCarts.map(cart => {
        const product = cart.product_id; // `product_id` ya está poblado con los detalles del producto
  
        return {
          userId: cart.user_id,
          productDetails: {
            _id: product._id,
            title: product.title,
            price: product.price,
            photo: product.photo,
          },
          quantity: cart.quantity,
          state: cart.state
        };
      });
  
      // Renderiza la vista con los datos
      return res.render("cart", { carts: cartData, userId });
    } catch (error) {
      return next(error);
    }
  }
  










export { create, readAll, read, update, destroy, showCart, showCartByUser };