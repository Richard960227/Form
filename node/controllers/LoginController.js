import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import StudentModel from '../models/StudentModel.js';
import TeacherModel from '../models/TeacherModel.js';
import { SelectedFormModel } from '../models/FormModel.js';

export const login = async (req, res) => {
    const { user, password } = req.body;

    try {
        let access;
        let passwordMatch = false;

        // Inicio de sesión de administrador
        access = await UserModel.findOne({ user });

        if (access) {
            // Comparar el password recibido con el password desencriptado almacenado en la base de datos
            passwordMatch = bcrypt.compare(password, access.password);
        } else {
            // Inicio de sesión de estudiante
            access = await StudentModel.findOne({ CORREO_PREF: user });

            if (access) {
                // Generar la contraseña almacenada a partir de la matrícula y compararla con el password recibido
                const generatedPassword = access.MATRICULA.toString();
                passwordMatch = password === generatedPassword;
            } 
        }

        // Si aún no se ha verificado el acceso y contraseña con StudentModel, entonces intentamos con TeacherModel
        if (!access || !passwordMatch) {
            // Inicio de sesión del docente
            access = await TeacherModel.findOne({ DOCENTE: user });

            if (access) {
                // Generar el usuario y contraseña a partir de las primeras letras del nombre y el campus
                const nameWords = access.DOCENTE.split(' ');
                const initials = nameWords.map((word) => word[0]).join('');

                const campusInitials = access.CAMPUS.split(' ').map((word) => word[0]).join('');
                const generatedPassword = `${initials}${campusInitials}`.toUpperCase();

                // Verificar la coincidencia de la contraseña generada con la contraseña proporcionada
                passwordMatch = password === generatedPassword;
            }
        }

        if (!access || !passwordMatch) {
            return res.status(401).json({ message: 'Usuario no encontrado o Contraseña incorrecta' });
        }

        // Obtener el rol del usuario
        const role = access.role;

        let tokenPermissions = [];

        // Generar el token con la información del usuario y los permisos asignados
        const token = jwt.sign({ userId: access._id, permissions: tokenPermissions }, 'secret_key');
        
        // Verificar el rol del usuario y asignar permisos de token
        if (role === 'administrador') {
            tokenPermissions = ['read', 'write', 'delete'];
            // Genera un hash aleatorio para la cookie
            const cookieHash = await bcrypt.hash(token, 10);

            // Crea la cookie con el hash y un tiempo de expiración de 1 hora
            res.cookie('token', cookieHash, { maxAge: 3600000, httpOnly: true });

            // Cerrar sesión después de 1 hora
            setTimeout(() => {
                if (!res.headersSent) {
                    res.clearCookie('token');
                }
            }, 3600000);
            res.status(200).json({ token, role });
        } else if (role === 'estudiante') {
            tokenPermissions = ['read']
            // Genera un hash aleatorio para la cookie
            const cookieHash = await bcrypt.hash(token, 10);

            // Crea la cookie con el hash y un tiempo de expiración de 1 hora
            res.cookie('token', cookieHash, { maxAge: 3600000, httpOnly: true });

            // Cerrar sesión después de 1 hora
            setTimeout(() => {
                if (!res.headersSent) {
                    res.clearCookie('token');
                }
            }, 3600000);
            res.status(200).json({ token, role });
        } else if (role === 'docente') {
            tokenPermissions = ['read']
            // Genera un hash aleatorio para la cookie
            const cookieHash = await bcrypt.hash(token, 10);

            // Crea la cookie con el hash y un tiempo de expiración de 1 hora
            res.cookie('token', cookieHash, { maxAge: 3600000, httpOnly: true });

            // Cerrar sesión después de 1 hora
            setTimeout(() => {
                if (!res.headersSent) {
                    res.clearCookie('token');
                }
            }, 3600000);
            res.status(200).json({ token, role });
        } else {
            return res.status(401).json({ message: 'Rol de usuario desconocido' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getStudentInfo = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token de la solicitud

    try {
        const decodedToken = jwt.verify(token, 'secret_key'); // Verificar y decodificar el token
        const studentId = decodedToken.userId; // Obtener el identificador del alumno del token

        // Buscar al estudiante por su ID de usuario
        const student = await StudentModel.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Obtener la matrícula del estudiante actual
        const matter = student.MATRICULA;

        // Buscar todos los docentes asociados a los alumnos con la misma matrícula en el modelo StudentModel
        const teachers = await StudentModel.find({ MATRICULA: matter }).distinct('DOCENTE');

        // Obtener la cantidad total de docentes que el estudiante debe evaluar
        const totalTeachers = teachers.length;

        // Buscar todos los docentes que el estudiante ha evaluado en el modelo SelectedFormModel
        const evaluatedTeachers = await SelectedFormModel.distinct('teacher', {
            matricula: matter,
        });

        // Obtener la cantidad de docentes que el estudiante ha evaluado
        const totalEvaluatedTeachers = evaluatedTeachers.length;

        // Verificar si el estudiante ha evaluado a todos sus docentes
        if (totalEvaluatedTeachers >= totalTeachers) {
            // Si el estudiante ha evaluado a todos sus docentes o más, deniega el acceso
            return res
                .status(403)
                .json({ message: 'Acceso denegado. Has completado todas las evaluaciones' });
        } else {
            // Si el estudiante aún no ha evaluado a todos sus docentes, permite el acceso
            return res.status(200).json({ totalEvaluatedTeachers, evaluatedTeachers });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};










