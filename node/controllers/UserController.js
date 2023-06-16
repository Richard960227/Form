import UserModel from '../models/UserModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id);
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
    const newUser = new UserModel(req.body);

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            req.body,
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
        const result = await UserModel.deleteMany({});
        res.json({ message: `${result.deletedCount} usuarios eliminados` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

