let users = []; //  Contiene todos los usuarios

function sync(data) {
  users = data; // Sincroniza los usuarios en memoria
  console.log("users memory manager sync", users);
  
}

export default {
  sync
};
