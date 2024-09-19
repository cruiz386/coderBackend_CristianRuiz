import usersFileManager from "../data/files/users.fileManager.js";
import usersMemoryManager from "../data/memory/users.memoryManager.js";

async function syncUserManagers() {
  const usersFromFile = await usersFileManager.readAll();
  usersMemoryManager.sync(usersFromFile);
}

class UserController {
  constructor() {}

  async readUsers(req, res, next) {
    try {
      const { role } = req.query;

      await syncUserManagers();

      const data = await usersFileManager.readAll(role);
      if (data.length > 0) {
        return res.status(200).json({ data, message: "users fetched" });
      } else {
        const error = new Error("users not found");
        error.statusCode = 404;
        throw error;
      }
    } catch (error) {
      return next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const data = req.body;
      const { email, password } = data;
      if (!email || !password) {
        const error = new Error("email and password are required");
        error.statusCode = 400;
        throw error;
      }
      const userId = await usersFileManager.create(data);

      await syncUserManagers();

      return res
        .status(201)
        .json({ message: `user created with id ${userId}` });
    } catch (error) {
      return next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { uid } = req.params;
      const user = await usersFileManager.destroy(uid);

      await syncUserManagers();

      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }

  async readUserById(req, res, next) {
    try {
      const { uid } = req.params;

      await syncUserManagers();

      const user = await usersFileManager.readById(uid);
      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { uid } = req.params;
      const data = req.body;

      const user = await usersFileManager.update(uid, data);

      await syncUserManagers();

      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }
}

const userController = new UserController();
export default userController;
