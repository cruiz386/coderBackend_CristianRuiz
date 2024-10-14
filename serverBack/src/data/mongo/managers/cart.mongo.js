/* import Cart from "../models/cart.model.js";

class CartMongoManager {
    async getCartByUserId(userId) {
        return await Cart.findOne({ user: userId }).populate("products.product");
    }

    async removeProductFromCart(userId, productId) {
        const cart = await this.getCartByUserId(userId);
        cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
        await cart.save();
    }

    async updateProductQuantity(userId, productId, quantity) {
        const cart = await this.getCartByUserId(userId);
        const productToUpdate = cart.products.find(p => p.product._id.toString() === productId);
        if (productToUpdate) {
            productToUpdate.quantity = quantity;
        }
        await cart.save();
    }

    async finalizePurchase(userId) {
        const cart = await this.getCartByUserId(userId);
        cart.products = []; // Limpiar el carrito tras la compra
        await cart.save();
        // Lógica adicional de finalizar compra (generar orden, reducir stock, etc.)
    }

    async clearCart(userId) {
        const cart = await this.getCartByUserId(userId);
        cart.products = [];
        await cart.save();
    }
}



const cartMongoManager = new CartMongoManager()
export default cartMongoManager */



import Cart from "../models/cart.model.js";
import Manager from "./manager.mongo.js";



const cartsManager = new Manager(Cart);
export default cartsManager;