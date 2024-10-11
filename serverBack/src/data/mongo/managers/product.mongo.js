//products manager de mongo
import productSyncManager from '../../sync/products.sync.js'; 
import Product from "../models/product.model.js";


class ProductsMongoManager {

    constructor() {

    }

    async create(data) {

        try {
            const product = await Product.create(data);
            await productSyncManager.syncProducts(); // Sincronizar con FS y memoria
            return product;
        } catch (error) {
            throw error;
        }

    };

    async readAll(category) {
        try {
            const query = category ? { category } : {}; // Filtrar por categoría si se proporciona
            const products = await Product.find(query);
            // Convertir los _id de ObjectId a strings
            return products.map(product => ({
                ...product.toObject(), // Convertir el documento a un objeto plano
                _id: product._id.toString() // Convertir ObjectId a string
            }));
        } catch (error) {
            throw error;
        }
    }
    

    async readById(pid) {
        try {
            const product = await Product.findById(pid);
            // Verificar si el producto existe y convertir el _id a string
            if (product) {
                return {
                    ...product.toObject(), // Para convertir el documento Mongoose a un objeto plano
                    _id: product._id.toString() // Convertir ObjectId a string
                };
            }
            return null; // Si no se encuentra el producto
        } catch (error) {
            throw error;
        }
    }
    

    async update(pid, newData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(pid, newData, { new: true });
            await productSyncManager.syncProducts(); // Sincronizar con FS y memoria
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }

    async destroy(productId) {
        try {
          const result = await Product.findByIdAndDelete(productId);
          if (!result) {
            throw new Error("Product not found");
          }
          await productSyncManager.syncProducts(); // Sincronizar con FS y memoria
            return result;
        } catch (error) {
          console.error("Error deleting product:", error);
          throw error;
        }
      }
      



}

const productMongoManager = new ProductsMongoManager(Product)
export default productMongoManager