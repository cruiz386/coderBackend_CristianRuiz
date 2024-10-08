import mongoose from 'mongoose'; // Asegúrate de importar mongoose correctamente
const { Schema, model } = mongoose; // Cambia 'schema' a 'Schema' (mayúscula)

const collection = 'users';

const userSchema = new Schema({
    photo: { type: String, default: 'https://i.ytimg.com/vi/bb5nPL38ptk/maxresdefault.jpg' }, // Correcta definición del tipo
    email: { type: String, required: true }, // Correcta definición del tipo
    password: { type: String, required: true }, // Correcta definición del tipo
    role: { type: String, default: 'user', enum: ['admin', 'user'] }, // Correcta definición del tipo
    isOnline: { type: Boolean, default: false } // Correcta definición del tipo
});

const User = model(collection, userSchema);
export default User;
