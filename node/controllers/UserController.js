import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUserData = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];// Obtener el token de la solicitud

    try {
        const decodedToken = jwt.verify(token, 'secret_key'); // Verificar y decodificar el token
        const userId = decodedToken.userId; // Obtener el identificador del alumno del token

        // Obtener la información del estudiante
        const users = await UserModel.findById(userId);

        if (!users) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        // Obtener solo el valor de la variable "user" del estudiante
        const name = users.name;

        res.status(200).json({ name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, '-password');

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id, '-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUser = async (req, res) => {
    const { name, user, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            user,
            password: hashedPassword,
            role
        });

        // Guardar el nuevo usuario en la base de datos
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, user, password, role } = req.body;

    try {
        // Encriptar la contraseña si está presente en la solicitud
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            req.body.password = hashedPassword;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { name, user, password, role },
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (deletedUser) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAllUsers = async (req, res) => {
    try {
        const deletedUsers = await UserModel.deleteMany({});
        if (deletedUsers) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Users not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

