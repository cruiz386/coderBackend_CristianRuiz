import { schema, model } from 'mongoose';

const collection = 'products';

const productSchema = new schema({
    title: { String, required: true },
    photo: { String, default: 'https://i.ytimg.com/vi/_LbbKKuimaM/maxresdefault.jpg' },
    category: { String, default: 'phones' },
    price: { Number, default: 1 },
    stock: { Number, default: 1 }
});

const Product = model(collection, productSchema);
export default Product;