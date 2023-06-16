import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('open', () => {console.log("¡Conectado a MongoDB!");});
db.on('error', () => {console.log("¡Error al conectar a MongoDB!");});

export default db;

export default db
