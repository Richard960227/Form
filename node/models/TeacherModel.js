import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    CAMPUS: {type: String},
    DOCENTE: {type: String},
    CLAVES_MATERIAS: [{type: String}],
    MATERIAS: [{type: String}],
    CAL_PROM: {type: Number},
    QUESTIONS: [{
        question: { type: String },
        answer: { type: Number },
    }],
    role: {type: String, default: 'docente'},
}, {collection: 'teachers'})

export default mongoose.model('TeacherModel', teacherSchema)