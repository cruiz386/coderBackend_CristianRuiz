import Product from "../models/product.model.js";


class ProductsMongoManager {

    constructor(collection) {
        this.collection = collection;
    }

    async create(data) {

        try {
            return await this.collection.create(data);
        } catch (error) {
            throw error;
        }

    };

    async readAll() {
        try {
            return await this.collection.find();
        } catch (error) {
            throw error;
        }

    };

    async readById(pid) {
        try {
            return await this.collection.findById(pid);
        } catch (error) {
            throw error;
        }
    }

    async update(pid, newData) {
        try {
            return await this.collection.findByIdAndUpdate(pid, newData, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async destroy(pid) {
        try {
            return await this.collection.findByIdAndDelete(pid);
        } catch (error) {
            throw error;
        }

    }




}

const productMongoManager = new ProductsMongoManager(Product)

export default productMongoManager
