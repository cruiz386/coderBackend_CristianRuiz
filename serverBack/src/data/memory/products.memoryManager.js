let products = []; // Contiene todos los productos

function sync(data) {
  products = data; // Sincroniza los productos en memoria
  console.log("products memory manager sync", products);
  
}
export default {
  sync
};
