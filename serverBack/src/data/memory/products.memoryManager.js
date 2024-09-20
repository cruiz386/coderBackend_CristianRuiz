import fs from 'fs';
import path from 'path';

class ProductsMemoryManager {
    constructor() {
        const __filename = new URL(import.meta.url).pathname;
        this.filePath = path.join(path.dirname(__filename), 'products.json');
        this.products = this.loadFromFile() || [];
    }

    loadFromFile() {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }

    saveToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    }

    readAll(category) {
        if (category) {
            return this.products.filter(product => product.category === category);
        }
        return this.products;
    }

    readById(id) {
        return this.products.find(product => product.id === id);
    }

    create(data) {
        this.products.push(data);
        this.saveToFile();
        return data;
    }

    destroy(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const removedProduct = this.products.splice(index, 1);
            this.saveToFile();
            return removedProduct;
        }
        return null;
    }

    update(id, newData) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...newData };
            this.saveToFile();
            return this.products[index];
        }
        return null;
    }

    sync(data) {
        this.products = data;
        this.saveToFile();
    }
}

const productsMemoryManager = new ProductsMemoryManager();
export default productsMemoryManager;
