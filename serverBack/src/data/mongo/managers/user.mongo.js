import User from './../models/user.model.js';
import mongoose from 'mongoose';
import userSyncManager from '../../sync/users.sync.js'; 


class UsersManager {

    constructor() { }

    async create(data) {
        try {
            const user = await User.create(data);
            await userSyncManager.syncUsers(); // Sincronizar con FS y memoria
            return user;
        } catch (error) {
            throw error;
        }
    }

    async readAll(role) {
        try {
          const query = role ? { role } : {}; // Filtra por rol si se proporciona
          const users = await User.find(query);
          return users;
        } catch (error) {
          throw new Error("Error fetching users");
        }
      }
    

      async readById(uid) {
        try {
            // Verifica si uid es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                throw new Error("Invalid User ID");
            }
    
            const user = await User.findById(uid);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw error; // Propaga el error hacia el controlador
        }
    }

    async update(id, data) {

        try {
            const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true });
            await userSyncManager.syncUsers(); // Sincronizar con FS y memoria
            return updatedUser;

        } catch (error) { 
            throw error;
        }
    }

    async destroy(id) {

        try {
            const deletedUser = await User.findByIdAndDelete(uid);
            await userSyncManager.syncUsers(); // Sincronizar con FS y memoria
            return deletedUser;

        } catch (error) {
            throw error;
        }
    }

    async findUser(email, password) {
        try {
            const user = await User.findOne({ email, password });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email) {
        try {
          const user = await User.findOne({ email });
          return user;
        } catch (error) {
          throw error;
        }
      }
      
}

const userMongoManager = new UsersManager();
export default userMongoManager;