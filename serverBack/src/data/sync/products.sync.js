import productMongoManager from '../mongo/managers/product.mongo.js';
import productsFileManager from '../files/products.fileManager.js';
class ProductSyncManager {
    constructor() {
        this.memoryProducts = []; // Array en memoria para almacenar los productos
    }

    async syncProducts() {
        try {
            // 1. Obtener todos los productos desde MongoDB
            const mongoProducts = await productMongoManager.readAll();

            // 2. Obtener todos los productos desde el file system
            const fileProducts = await productsFileManager.readAll();

            // 3. Crear un map para comparar los productos por ID
            const fileProductMap = new Map(fileProducts.map(product => [product._id, product]));

            // 4. Sincronizar MongoDB con el file system
            for (const mongoProduct of mongoProducts) {
                if (fileProductMap.has(mongoProduct._id)) {
                    const fileProduct = fileProductMap.get(mongoProduct._id);
                    if (JSON.stringify(fileProduct) !== JSON.stringify(mongoProduct)) {
                        await productsFileManager.update(mongoProduct._id, mongoProduct);
                    }
                } else {
                    await productsFileManager.create(mongoProduct);
                }
            }

            // 5. Eliminar productos en el file system que ya no existen en MongoDB
            for (const fileProduct of fileProducts) {
                if (!mongoProducts.some(mongoProduct => mongoProduct._id === fileProduct._id)) {
                    await productsFileManager.destroy(fileProduct._id);
                }
            }

            // 6. Sincronizar datos en memoria
            this.memoryProducts = mongoProducts; // Actualizar el array en memoria
            console.log('Products synchronized successfully in FS and Memory.');
        } catch (error) {
            console.error('Error synchronizing products:', error);
        }
    }

    getMemoryProducts() {
        return this.memoryProducts;
    }
}

const productSyncManager = new ProductSyncManager();
export default productSyncManager;


