/* import usersFileManager from "../data/files/users.fileManager.js";
import usersMemoryManager from "../data/memory/users.memoryManager.js";
import isValidDataUser from "../middlewares/isValidDataUsers.mid.js";

async function syncUserManagers() {
  const usersFromFile = await usersFileManager.readAll();
  usersMemoryManager.sync(usersFromFile);
}

class UserController {
  constructor() { }

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
      // Validar los datos del usuario
      await isValidDataUser(req, res, next);

      const data = req.body; 

      // Crear el usuario
      const userId = await usersFileManager.create(data);
      await syncUserManagers();
      return res.status(201).json({ message: `User created with id ${userId}` });
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

const registerView = async (req, res, next) => {
  try {
    const users = await usersFileManager.readAll();
    return res.render("register", { users });
  } catch (error) {
    next(error);
  }
};

const loginView = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await usersFileManager.readAll();
    // Validar los datos de inicio de sesión
    if (!email || !password) {
      return res.render("login", { error: "Please provide an email and password" });
    }

    // Validar credenciales de inicio de sesión
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      return res.render("main", { user });
    } else {
      return res.render("login", { error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};
const logoutView = async (req, res, next) => {

  try {
    return res.render("login");
  } catch (error) {
    next(error);
  }
};

const profileView = async (req, res, next) => {
  const { uid } = req.params;

  try {
    await syncUserManagers();
    const user = await usersFileManager.readById(uid);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return res.render("profile", { user });
  } catch (error) {
    return next(error);
  }
};





const userController = new UserController();

export { registerView, loginView, logoutView, profileView };
export default userController;
 */

// user controller con Mongo

import userMongoManager from "../data/mongo/managers/user.mongo.js";


class UserControllerMongo {
  async readUsers(req, res, next) {
    try {
      const { role } = req.query;
      const data = await userMongoManager.readAll(role);
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
      // Validar los datos del usuario
      //await isValidDataUser(req, res, next);

      const data = req.body; 

      // Crear el usuario
      const userId = await userMongoManager.create(data);
      return res.status(201).json({ message: `User created with id ${userId}` });
    } catch (error) {
      return next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { uid } = req.params;
      const user = await userMongoManager.destroy(uid);
      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }

  async readUserById(req, res, next) {
    try {
      const { uid } = req.params;
      const user = await userMongoManager.readById(uid);
      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { uid } = req.params;
      const data = req.body;
      const user = await userMongoManager.update(uid, data);
      return res.status(200).json({ statusCode: 200, response: user });
    } catch (error) {
      return next(error);
    }
  }
}

const registerView = async (req, res, next) => {
  try {
    const users = await userMongoManager.readAll();
    return res.render("register", { users });
  } catch (error) {
    next(error);
  }
};

const loginView = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await userMongoManager.readAll();
    // Validar los datos de inicio de sesión
    if (!email || !password) {
      return res.render("login", { error: "Please provide an email and password" });
    }

    // Validar credenciales de inicio de sesión
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      return res.render("main", { user });
    } else {
      return res.render("login", { error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};
const logoutView = async (req, res, next) =>{

  try {
    return res.render("login");
  } catch (error) {
    next(error);
  }
};

const profileView = async (req, res, next) => {
  const { uid } = req.params;

  try {
    const users = await userMongoManager.readAll();
    const user = users.find((user) => user.uid === uid);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return res.render("profile", { user: user.toObject({getters: true}) });
  } catch (error) {
    return next(error);
  }
};



const userControllerMongo = new UserControllerMongo();

export { registerView, loginView, logoutView, profileView };
export default userControllerMongo;