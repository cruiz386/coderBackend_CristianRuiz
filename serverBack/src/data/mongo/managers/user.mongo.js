import User from './../models/user.model.js';
import mongoose from 'mongoose';
import userSyncManager from '../../sync/users.sync.js';


class UsersManager {

    constructor() { }

    async create(data) {
        try {
            const user = await User.create(data);
            await userSyncManager.syncUsers(); 
            return user;
        } catch (error) {
            throw error;
        }
    }

    async readAll(role) {
        try {
            const query = role ? { role } : {}; 
            const users = await User.find(query);
            return users;
        } catch (error) {
            throw new Error("Error fetching users");
        }
    }

    async readById(uid) {
        try {
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                throw new Error("Invalid User ID");
            }
            const user = await User.findById(uid);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async update(uid, data) {
        try {
            const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true });
            await userSyncManager.syncUsers(); 
            return updatedUser;

        } catch (error) {
            throw error;
        }
    }

    async destroy(uid) {
        try {
            const deletedUser = await User.findByIdAndDelete(uid);
            await userSyncManager.syncUsers(); 
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