import fs from "fs";
import crypto from "crypto";

class UsersManager {
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

  async readAll(role) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const parseData = JSON.parse(data);
      if (role) {
        const filteredData = parseData.filter((user) => user.role === role);
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
      const allUsers = await this.readAll();
      const user = allUsers.find((user) => user.id === id.toString());
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(userData) {
    try {
      userData.id = crypto.randomBytes(12).toString("hex");
      const allUsers = await this.readAll();
      allUsers.push(userData);

      const stringData = JSON.stringify(allUsers, null, 2);
      await fs.promises.writeFile(this.path, stringData);
      return userData.id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id, newData) {
    try {
      const allUsers = await this.readAll();
      const index = allUsers.findIndex((user) => user.id === id.toString());
      if (index === -1) {
        throw new Error("User not found");
      }
      allUsers[index] = { ...allUsers[index], ...newData };
      const stringAll = JSON.stringify(allUsers, null, 2);
      await fs.promises.writeFile(this.path, stringAll);
      return allUsers[index];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async destroy(id) {
    try {
      if (!id) {
        return null;
      }
      const allUsers = await this.readAll();
      const index = allUsers.findIndex((user) => user.id === id.toString());
      if (index === -1) {
        return null;
      }
      allUsers.splice(index, 1);
      const stringAll = JSON.stringify(allUsers, null, 2);
      await fs.promises.writeFile(this.path, stringAll);
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findUser(email, password) {
    try {
      const allUsers = await this.readAll();
      const user = allUsers.find(
        (user) => user.email === email && user.password === password
      );
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      console.log(error); 
      throw error;
    } 
  } 
  
}


const usersFileManager = new UsersManager("./src/data/files/users.json");
export default usersFileManager;
