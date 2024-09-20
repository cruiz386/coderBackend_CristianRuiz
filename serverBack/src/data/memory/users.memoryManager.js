class UsersMemoryManager {
  constructor() {
    this.users = [];
  }

  readAll() {
    return this.users;
  }


  readById(id) {
    return this.users.find((user) => user.id === id);
  }


  create(data) {
    this.users.push(data);
    return data;
  }


  update(id, newData) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...newData };
      return this.users[index];
    }
    return null;
  }


  destroy(id) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      return this.users.splice(index, 1);
    }
    return null;
  }



  sync(data) {
    this.users = data;
  }
}

const usersMemoryManager = new UsersMemoryManager();
export default usersMemoryManager;
