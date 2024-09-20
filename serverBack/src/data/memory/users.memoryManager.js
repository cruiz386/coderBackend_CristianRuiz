import fs from 'fs';
import path from 'path';

class UsersMemoryManager {
    constructor() {
        const __filename = new URL(import.meta.url).pathname;
        this.filePath = path.join(path.dirname(__filename), 'users.json');
        this.users = this.loadFromFile() || [];
    }

    loadFromFile() {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }

    saveToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
    }

    readAll(role) {
        if (role) {
            return this.users.filter(user => user.role === role);
        }
        return this.users;
    }

    readById(id) {
        return this.users.find(user => user.id === id);
    }

    create(data) {
        this.users.push(data);
        this.saveToFile();
        return data;
    }

    destroy(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            const removedUser = this.users.splice(index, 1);
            this.saveToFile();
            return removedUser;
        }
        return null;
    }

    update(id, newData) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...newData };
            this.saveToFile();
            return this.users[index];
        }
        return null;
    }

    sync(data) {
        this.users = data;
        this.saveToFile();
    }
}

const usersMemoryManager = new UsersMemoryManager();
export default usersMemoryManager;
