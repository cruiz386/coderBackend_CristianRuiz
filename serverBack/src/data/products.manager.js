import fs from "fs";
import crypto from "crypto";

class ProductsManager {
  constructor(path) {
    this.path = path;
    this.exists();
  }


  exists() {
    const exist = fs.existsSync(this.path);
    if (!exist) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("File created");
    } else {
      console.log("File already exists");
    }
  }

  async readAll() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.log(error);
      throw new Error("Error reading products");
    }
  }

  async readById(id) {
    try {
      const allProducts = await this.readAll();
      // Comparar ambos como cadenas de texto
      const product = allProducts.find((product) => product.id === id.toString());
      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(data) {
    try {
      data.id = crypto.randomBytes(12).toString("hex"); // Genera un ID único
      const allProducts = await this.readAll();
      allProducts.push(data);
            
      const stringAll = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, stringAll);
      return data.id;
    } catch (error) {
      console.log(error);
      throw new Error("Error creating product");
    }
  }

  async update(id, newData) {
    try {
      const allProducts = await this.readAll();
      const index = allProducts.findIndex((product) => product.id === id.toString());
      if (index === -1) {
        throw new Error("Product not found");
      }
      allProducts[index] = { ...allProducts[index], ...newData };
      const stringAll = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, stringAll);
      return allProducts[index];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async destroy(id) {
    try {
      // if (!id) {
      //   throw new Error("Product ID is required");
      // }
      const allProducts = await this.readAll();
      const index = allProducts.findIndex((product) => product.id === id.toString());
      if (index === -1) {
        throw new Error("Product not found");
      }
      allProducts.splice(index, 1);
      const stringAll = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, stringAll);
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  


}

const productsManager = new ProductsManager("./src/data/files/products.json");
export default productsManager;
