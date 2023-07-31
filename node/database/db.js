import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/evaluacion_docente'
mongoose.connect(url)

const db = mongoose.connection
db.on('open', () => {console.log("Successfull Connection")})
db.on('error', () => {console.log("Unsuccessfull Connection")})

export default db