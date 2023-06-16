import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String},
    user: {type: String},
    password: {type: String},
    role: {type: String}
}, {collection: 'users'})

export default mongoose.model('UserModel', userSchema)