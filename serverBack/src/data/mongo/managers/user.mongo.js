import User from './../models/user.model.js';
import mongoose from 'mongoose';

class UsersManager {

    constructor() { }

    async create(data) {
        try {
            const user = await User.create(data);
            return user.id;
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
    

      async readById(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {

        try {
            const user = await User.findByIdAndUpdate(id, data, { new: true });
            return user;

        } catch (error) { 
            throw error;
        }
    }

    async destroy(id) {

        try {
            const user = await User.findByIdAndDelete(id);
            return user;

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
}

const userMongoManager = new UsersManager();
export default userMongoManager;