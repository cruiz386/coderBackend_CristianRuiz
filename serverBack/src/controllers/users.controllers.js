import usersManager from "../data/managers/users.manager.js";

class UserController {
  constructor() {}

  async readUsers(req, res, next) {
    try {
      const { role } = req.query;
      const data = await usersManager.readAll(role);
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
      const userId = await usersManager.create(data);
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
      const user = await usersManager.destroy(uid);
      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }

  async readUserById(req, res, next) {
    try {
      const { uid } = req.params;
      const user = await usersManager.readById(uid);
      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { uid } = req.params;
      const data = req.body;
      const user = await usersManager.update(uid, data);
      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }
}

const userController = new UserController();
export default userController;
