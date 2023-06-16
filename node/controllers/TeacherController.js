import TeacherModel from '../models/StudentModel.js';

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.find();
        const uniqueTeachers = teachers.filter((item, index, arr) => {
            return index === arr.findIndex((i) => i.CLAVE_MATERIA === item.CLAVE_MATERIA);
        });
        res.status(200).json(uniqueTeachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await TeacherModel.findById(id);
        if (teacher) {
            res.status(200).json(teacher);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

