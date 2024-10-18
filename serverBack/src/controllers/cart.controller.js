
import cartManager from "../data/mongo/managers/cart.mongo.js";
import Cart from "../data/mongo/models/cart.model.js";



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
    const { cid } = req.params;
    const response = await cartManager.read(cid);
    return res.status(200).json({  response });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const  data  = req.body;
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

const destroyAll = async (req, res, next) => {
  try {
    const response = await cartManager.destroyAll();
    return res.status(200).json({ message: "Carts destroyed", response });
  } catch (error) {
    return next(error);
  }
}

async function showCartByUser(req, res, next) {
  try {
    const { uid } = req.params;
    if (!uid || uid === 'url') {
      return res.status(400).send('Invalid user ID');
    }
    const carts = await cartManager.readCartsByUserId(uid);
    if (!carts || carts.length === 0) {
      return res.render("cart", { carts: [], uid });
    }
    const populatedCarts = await Cart.populate(carts, { path: 'product_id', model: 'products' });
    const cartData = populatedCarts.map(cart => {
      const product = cart.product_id;
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
    return res.render("cart", { carts: cartData, uid });
  } catch (error) {
    return next(error);
  }
}

 
async function readByUserId(req, res, next) {
  try {
    const { uid } = req.query;
    console.log(`Query UID: ${uid}`); // Para verificar el UID recibido
    const carts = await cartManager.readCartsByUserId(uid);
    
    console.log(`Carts found: ${JSON.stringify(carts)}`); // Para ver los carritos encontrados

    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: 'No carts found for this user' });
    }

    return res.status(200).json({ message: 'Carts read', response: carts });
  } catch (error) {
    console.error('Error in readByUserId:', error);
    return next(error);
  }
}


const calculateTotal = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const response = await cartManager.calculateTotal(uid);
    return res.status(200).json({ message: "Carts read", response });
  } catch (error) {
    return next(error);
  }
};


export { create, readAll, read, update, destroy, showCartByUser, calculateTotal, destroyAll, readByUserId };