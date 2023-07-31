import mongoose from "mongoose";
const Schema = mongoose.Schema;

const formSchema = new Schema({
    title: { type: String },
    description: { type: String },
    questions: [{
        question: { type: String },
        type: { type: String, enum: ['scale', 'multiple-choice', 'text'], default: 'text' },
        scale: {
            min: { type: Number },
            max: { type: Number },
            step: { type: Number },
            start: { type: Number },
            end: { type: Number },
        },
        options: [{
            option: { type: String },
        }],
        answer: { type: Schema.Types.Mixed },
    }],
}, { collection: 'forms' });

const selectedformSchema = new Schema({
    title: { type: String },
    description: { type: String },
    questions: [{
        question: { type: String },
        type: { type: String, enum: ['scale', 'multiple-choice', 'text'], default: 'text' },
        scale: {
            min: { type: Number },
            max: { type: Number },
            step: { type: Number },
            start: { type: Number },
            end: { type: Number },
        },
        options: [{
            option: { type: String },
        }],
        answer: { type: mongoose.Schema.Types.Mixed },
    }],
    teacher: { type: String },
    campus: { type: String },
    nivel: { type: String },
    bloque: { type: String },
    programa: {type: String},
    matricula: { type: String },
    cal_prom: { type: Number }
}, {collection: 'selectedform'});

export const FormModel = mongoose.model('FormModel', formSchema);
export const SelectedFormModel = mongoose.model('SelectedFormModel', selectedformSchema);