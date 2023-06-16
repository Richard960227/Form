import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    CAMPUS: {type: String},
    NIVEL: {type: String},
    PARTE_PERIODO: {type: String},
    CRN: {type: Number},
    CLAVE_MATERIA: {type: String},
    MATERIA: {type: String},
    SOCIO_INTEG: {type: String},
    PERIODO: {type: Number},
    BLOQUE: {type: String},
    MATRICULA: {type: Number},
    ALUMNO: {type: String},
    ESTATUS: {type: String},
    TIPO_ALUMNO: {type: String},
    CLAVE_PROGRAMA: {type: String},
    PROGRAMA: {type: String},
    DOCENTE: {type: String},
    CORREO_PREF: {type: String},
    DOCENTES: [{ type: Schema.Types.ObjectId }],
    CLAVES_MATERIAS: [{ type: Schema.Types.ObjectId}],
    MATERIAS: [{ type: Schema.Types.ObjectId}],
    role: {type: String, default: 'estudiante'},
}, {collection: 'students'})

export default mongoose.model('StudentModel', studentSchema)

