class ProductsMemoryManager {
    constructor() {
      this.products = [];
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
      return data;
    }
  

    destroy(id) {
      const index = this.products.findIndex(product => product.id === id);
      if (index !== -1) {
        return this.products.splice(index, 1);
      }
      return null;
    }
  

    update(id, newData) {
      const index = this.products.findIndex(product => product.id === id);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...newData };
        return this.products[index];
      }
      return null;
    }
  

    sync(data) {
      this.products = data;
    }
  }
  
  const productsMemoryManager = new ProductsMemoryManager();
  export default productsMemoryManager;
  