import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const { Schema, model } = mongoose;

const collection = 'products';

const productSchema = new Schema({
    title: { type: String, required: true, index: true },
    photo: { type: String, default: 'https://i.ytimg.com/vi/_LbbKKuimaM/maxresdefault.jpg' },
    category: { type: String, default: 'phones', index: true  },
    price: { type: Number, default: 1 },
    stock: { type: Number, default: 1 }
});


productSchema.plugin(mongoosePaginate);

const Product = model(collection, productSchema);
export default Product;
