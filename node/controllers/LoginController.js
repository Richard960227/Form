import LoginModel from "../models/UserModel.js";
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    const { user, password } = req.body;

    try {
        // Busca al usuario en la base de datos por su nombre de usuario
        const access = await LoginModel.findOne({ user });

        if (!access) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Compara la contraseña ingresada con la contraseña almacenada en la base de datos
        if (password !== access.password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Genera un token de acceso y lo envía en la respuesta
        const token = jwt.sign({ userId: access._id }, 'secret_key');
        res.status(200).json({ token });
        console.log('Acceso Correcto')
    } catch (error) {
        res.status(500).json({ message: "Error de Login" });
    }
}