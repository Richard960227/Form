import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import StudentModel from '../models/StudentModel.js';

export const login = async (req, res) => {
    const { user, password } = req.body;

    try {
        let access;
        let passwordMatch = false;

        // Inicio de sesión de administrador
        access = await UserModel.findOne({ user });

        if (access) {
            passwordMatch = bcrypt.compare(password, access.password);
        } else {
            // Inicio de sesión de estudiante
            access = await StudentModel.findOne({ CORREO_PREF: user });

            if (access) {
                const generatedPassword = access.MATRICULA.toString();
                passwordMatch = bcrypt.compare(password, generatedPassword);
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
        console.log(token)

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
        } else {
            return res.status(401).json({ message: 'Rol de usuario desconocido' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
