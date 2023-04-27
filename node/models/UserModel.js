import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user: {type: String},
    password: {type: String},
}, {collection: 'users'})

export default mongoose.model('UserModel', userSchema)