//products manager de mongo
import productSyncManager from '../../sync/products.sync.js';
import Product from "../models/product.model.js";


class ProductsMongoManager {

    constructor() {
    }

    async create(data) {
        try {
            const product = await Product.create(data);
            await productSyncManager.syncProducts();
            return product;
        } catch (error) {
            throw error;
        }
    };

    async readAll(category) {
        try {
            const query = category ? { category } : {};
            const products = await Product.find(query);

            return products.map(product => ({
                ...product.toObject(),
                _id: product._id.toString()
            }));
        } catch (error) {
            throw error;
        }
    }

    paginate = async (category, paginate) => {
        try {
            const query = category ? { category } : {};
            const products = await Product.paginate(query, {
                ...paginate,
                lean: true
            });
            return products;
        } catch (error) {
            throw error;
        }
    };

    async readById(pid) {
        try {
            const product = await Product.findById(pid);
            if (product) {
                return {
                    ...product.toObject(),
                    _id: product._id.toString()
                };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async update(pid, newData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(pid, newData, { new: true });
            await productSyncManager.syncProducts();
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
            await productSyncManager.syncProducts();
            return result;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }

}

const productMongoManager = new ProductsMongoManager(Product)
export default productMongoManager