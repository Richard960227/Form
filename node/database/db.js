import mongoose from 'mongoose';
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection
db.on('open', () => {console.log("¡Conectado a MongoDB!")})
db.on('error', () => {console.log("¡Error al conectar a MongoDB!")})

export default db
