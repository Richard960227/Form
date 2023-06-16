import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import loginRoute from './routes/loginRoute.js';
import userRoutes from './routes/userRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import formRoutes from './routes/formRoute.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

app.use( cors() );
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/login', loginRoute);
app.use('/home/users', userRoutes);
app.use('/home/teachers', teacherRoutes);
app.use('/home/students', studentRoutes);
app.use('/home/form', formRoutes);

app.listen(8000, () => {
    console.log('Server up running in http://localhost:8000/')
});



