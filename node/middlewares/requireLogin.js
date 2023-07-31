import jwt from 'jsonwebtoken';

const requireLogin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado. Inicia sesión primero.' });
    }

    try {
        const decodedToken = jwt.verify(token, 'secret_key'); // Verificar y decodificar el token
        req.userId = decodedToken.userId; // Agregar el ID del usuario al objeto de solicitud (req) para usarlo en las rutas protegidas
        next(); // Si el token es válido, continúa con la siguiente función de middleware o ruta
    } catch (error) {
        return res.status(401).json({ message: 'Acceso no autorizado. Token inválido o expirado.' });
    }
};

export default requireLogin;
