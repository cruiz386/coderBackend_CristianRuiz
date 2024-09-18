import fs from "fs";
import crypto from "crypto";

class UsersManager {
  constructor() {
    this.path = "./src/data/files/users.json";
    this.init();
  }

  init() {
    const fileExists = fs.existsSync(this.path);
    if (fileExists) {
      console.log("file already exists");
    } else {
      fs.writeFileSync(this.path, JSON.stringify([]));
      console.log("file created");
    }
  }

  async readAll(role) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const parsedData = JSON.parse(data);
      if (role) {
        const filteredData = parsedData.filter((each) => each.role === role);
        return filteredData;
      }
      return parsedData;
    } catch (error) {
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
      //throw error;
    }
  }

  async destroy(id) {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }
      const allUsers = await this.readAll();
      const index = allUsers.findIndex((user) => user.id === id.toString());
      if (index === -1) {
        throw new Error("User not found");
      }
      allUsers.splice(index, 1);
      const stringAll = JSON.stringify(allUsers, null, 2);
      await fs.promises.writeFile(this.path, stringAll);
      return id;
    } catch (error) {
      console.log(error);
      //throw error;
    }
  }
}

const usersManager = new UsersManager();
export default usersManager;
