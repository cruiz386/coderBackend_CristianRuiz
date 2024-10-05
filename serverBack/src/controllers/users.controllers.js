import usersFileManager from "../data/files/users.fileManager.js";
import usersMemoryManager from "../data/memory/users.memoryManager.js";

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
      const data = req.body;
      const userId = await usersFileManager.create(data);

      await syncUserManagers();

      return res
        .status(201)
        .json({ message: `User created with id ${userId}` });
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
    const users = await usersFileManager.readAll()
    return res.render("register", { users })
  } catch (error) {
    next(error);
  }
}

// Controlador de login
const loginView = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await usersFileManager.readAll();

    const user = users.find(user => user.email === email && user.password === password);
 
    if (!user) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    // Guardar el usuario en la sesión
    req.session.user = user;
    
    const products = await productsFileManager.readAll();
    return res.render("adminproducts", { products }); 
  } catch (error) {
    next(error);
  }
};

const logoutView = async (req, res, next) => {
  try {
    // Borrar la sesión
    req.session.destroy();
    return res.redirect("/login");
  } catch (error) {
    next(error);
  }
};


 


 
const userController = new UserController();

export { registerView, loginView, logoutView }; 
export default userController;