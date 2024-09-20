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

  async readAll(category) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const parseData = JSON.parse(data);

      if (category) {
        const filteredData = parseData.filter(
          (each) => each.category === category
        );
        return filteredData;
      } else {
        return parseData;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async readById(id) {
    try {
      const allProducts = await this.readAll();
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
      data.id = crypto.randomBytes(12).toString("hex"); 
      const allProducts = await this.readAll();
      allProducts.push(data);

      const stringAll = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, stringAll);
      return data.id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id, newData) {
    try {
      const allProducts = await this.readAll();
      const index = allProducts.findIndex(
        (product) => product.id === id.toString()
      );
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
      if (!id) {
        //   throw new Error("Product ID is required");
        return null;
      }
      const allProducts = await this.readAll();
      const index = allProducts.findIndex(
        (product) => product.id === id.toString()
      );
      if (index === -1) {
        return null;
        //throw new Error("Product not found");
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

const productsFileManager = new ProductsManager("./src/data/files/products.json");
export default productsFileManager;
