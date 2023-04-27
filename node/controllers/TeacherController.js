import TeacherModel from "../models/TeacherModel.js";

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.find();
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getTeacher = async (req, res) => {
    const { id } = req.params.id;

    try {
        const teacher = await TeacherModel.findById(id);
        if (teacher) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const createTeacher = async (req, res) => {
    const newTeacher = new TeacherModel(req.body);
    
    try {
        const savedTeacher = await newTeacher.save(req.body);
        res.status(200).json(savedTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedTeacher = await TeacherModel.findByIdAndUpdate(
            id, 
            req.body, 
            {new: true,}
        );
        if (updatedTeacher) {
            res.status(200).json(updatedTeacher);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTeacher = await TeacherModel.findByIdAndDelete(id);
        if (deletedTeacher) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
