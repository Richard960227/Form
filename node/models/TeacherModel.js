import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    name: {type: String},
    lastname1: {type: String},
    lastname2: {type: String},
    subject: {type: String},
}, {collection: 'teachers'})

export default mongoose.model('TeacherModel', teacherSchema)