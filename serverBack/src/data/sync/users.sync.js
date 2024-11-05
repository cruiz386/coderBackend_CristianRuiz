import userMongoManager from '../mongo/managers/user.mongo.js';
import usersFileManager from '../files/users.fileManager.js';

class UserSyncManager {
    constructor() {
        this.memoryUsers = []; // Array en memoria para almacenar los usuarios
    }

    async syncUsers() {
        try {
            // 1. Obtener todos los usuarios desde MongoDB
            const mongoUsers = await userMongoManager.readAll();

            // 2. Obtener todos los usuarios desde el file system
            const fileUsers = await usersFileManager.readAll();

            // 3. Crear un map para comparar los usuarios por ID
            const fileUserMap = new Map(fileUsers.map(user => [user._id, user]));

            // 4. Sincronizar MongoDB con el file system
            for (const mongoUser of mongoUsers) {
                if (fileUserMap.has(mongoUser._id)) {
                    const fileUser = fileUserMap.get(mongoUser._id);
                    if (JSON.stringify(fileUser) !== JSON.stringify(mongoUser)) {
                        await usersFileManager.update(mongoUser._id, mongoUser);
                    }
                } else {
                    await usersFileManager.create(mongoUser);
                }
            }

            // 5. Eliminar usuarios en el file system que ya no existen en MongoDB
            for (const fileUser of fileUsers) {
                if (!mongoUsers.some(mongoUser => mongoUser._id === fileUser._id)) {
                    await usersFileManager.destroy(fileUser._id);
                }
            }

            // 6. Sincronizar datos en memoria
            this.memoryUsers = mongoUsers; // Actualizar el array en memoria
            console.log('Users synchronized successfully in FS and Memory.');
        } catch (error) {
            console.error('Error synchronizing users:', error);
        }
    }

    getMemoryUsers() {
        return this.memoryUsers;
    }
}

const userSyncManager = new UserSyncManager();
export default userSyncManager;
