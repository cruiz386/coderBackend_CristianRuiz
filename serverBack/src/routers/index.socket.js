import usersFileManager from "../data/files/users.fileManager.js";

const socketCb = (socket) => {
  console.log(`client ${socket.id} connected`);

  // Maneja la creación de un nuevo usuario y actualiza la lista para todos
  socket.on("new user", async (data) => {
    await usersFileManager.create(data);
    const allUsers = await usersFileManager.readAll();
    // Envía la lista de usuarios actualizada al cliente
    socket.emit("update user", allUsers);
  });
};

export default socketCb;
