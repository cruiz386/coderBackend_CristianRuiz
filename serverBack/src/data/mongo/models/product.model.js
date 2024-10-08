import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const collection = 'products';

const productSchema = new Schema({
    title: { type: String, required: true }, // Correcta definición del tipo y requerido
    photo: { type: String, default: 'https://i.ytimg.com/vi/_LbbKKuimaM/maxresdefault.jpg' },
    category: { type: String, default: 'phones' },
    price: { type: Number, default: 1 },
    stock: { type: Number, default: 1 }
});

const Product = model(collection, productSchema);
export default Product;
