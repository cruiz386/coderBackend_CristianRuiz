import mongoose from 'mongoose'; 
const { Schema, model } = mongoose; 

const collection = 'users';

const userSchema = new Schema({
    photo: { type: String, default: 'https://i.ytimg.com/vi/bb5nPL38ptk/maxresdefault.jpg' }, 
    email: { type: String, required: true, index: true  }, 
    password: { type: String, required: true }, 
    role: { type: String, default: 'user', enum: ['admin', 'user'] , index: true }, 
    isOnline: { type: Boolean, default: false } 
});

const User = model(collection, userSchema);
export default User;
