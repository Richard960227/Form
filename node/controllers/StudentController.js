import StudentModel from "../models/StudentModel.js";
import TeacherModel from '../models/TeacherModel.js';
import { SelectedFormModel } from '../models/FormModel.js';
import xlsx from 'xlsx';
import fs from 'fs';
import jwt from 'jsonwebtoken';

export const getStudentData = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token de la solicitud

    try {
        const decodedToken = jwt.verify(token, 'secret_key'); // Verificar y decodificar el token
        const studentId = decodedToken.userId; // Obtener el identificador del alumno del token

        // Obtener la matrícula del estudiante actual
        const student = await StudentModel.findById(studentId);
        const matter = student.MATRICULA;

        // Buscar todos los docentes asociados a los alumnos con la misma matrícula
        const teachers = await StudentModel.distinct('DOCENTE', { MATRICULA: matter });
        const evaluatedTeachers = await SelectedFormModel.distinct('teacher', {
            matricula: matter,
        });

        const missingDocentes = teachers.filter((docente) => !evaluatedTeachers.includes(docente));

        const keys_subjects = await StudentModel.distinct('CLAVE_MATERIA', { MATRICULA: matter});
        const subjects = await StudentModel.distinct('MATERIA', { MATRICULA: matter });
        
        if (teachers.length === 0 || subjects.length === 0) {
            return res.status(404).json({ message: 'Student Not Found' });
        }

        // Unificar la información del estudiante
        const StudentUnique = {
            CAMPUS: student.CAMPUS,
            NIVEL: student.NIVEL,
            PARTE_PERIODO: student.PARTE_PERIODO,
            CRN: student.CRN,
            SOCIO_INTEG: student.SOCIO_INTEG,
            PERIODO: student.PERIODO,
            BLOQUE: student.BLOQUE,
            MATRICULA: student.MATRICULA,
            ALUMNO: student.ALUMNO,
            ESTATUS: student.ESTATUS,
            TIPO_ALUMNO: student.TIPO_ALUMNO,
            CLAVE_PROGRAMA: student.CLAVE_PROGRAMA,
            PROGRAMA: student.PROGRAMA,
            CORREO_PREF: student.CORREO_PREF,
            DOCENTES: missingDocentes,
            CLAVES_MATERIAS: keys_subjects,
            MATERIAS: subjects,
        };

        res.status(200).json({ Student: StudentUnique });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await StudentModel.find();
        const uniqueStudents = students.filter((item, index, arr) => {
            return index === arr.findIndex((i) => i.MATRICULA === item.MATRICULA);
        });
        res.status(200).json(uniqueStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await StudentModel.findById(id);
        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createStudent = async (req, res) => {
    const newStudent = new StudentModel(req.body);

    try {
        const savedStudent = await newStudent.save();
        res.status(200).json(savedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal serever error' });
    }
};

export const updateStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedStudent = await StudentModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, }
        );
        if (updatedStudent) {
            res.status(200).json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStudent = await StudentModel.findByIdAndDelete(id);
        if (deletedStudent) {
            res.json({ message: 'Estudiante eliminado' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAllStudents = async (req, res) => {
    try {
        const studentResult = await StudentModel.deleteMany({});
        const teacherResult = await TeacherModel.deleteMany({});
        res.json({
            message: `${studentResult.deletedCount} estudiantes y ${teacherResult.deletedCount} docentes eliminados`,
            studentsDeleted: studentResult.deletedCount,
            teachersDeleted: teacherResult.deletedCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const validationRules = {
    CAMPUS: { required: true },
    NIVEL: { required: true },
    PARTE_PERIODO: { required: true },
    CRN: { required: true, numeric: true },
    CLAVE_MATERIA: { required: true },
    MATERIA: { required: true },
    SOCIO_INTEG: { required: true },
    PERIODO: { required: true, numeric: true },
    BLOQUE: { required: true },
    MATRICULA: { required: true, numeric: true },
    ALUMNO: { required: true },
    ESTATUS: { required: true },
    TIPO_ALUMNO: { required: true },
    CLAVE_PROGRAMA: { required: true },
    PROGRAMA: { required: true },
    DOCENTE: { required: true },
    CORREO_PREF: { required: true },
};

const sanitize = (data) => {
    return data.map((item) => {
        return Object.entries(item).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'string' ? value.trim() : value;
            return acc;
        }, {});
    });
};

export const uploadFileStudents = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Please upload an Excel file' });
        }
        if (!file.originalname.endsWith('.xlsx')) {
            return res.status(400).json({ message: 'Please upload an Excel file' });
        }

        const workbook = xlsx.read(fs.readFileSync(file.path));
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        fs.unlinkSync(req.file.path);

        const sanitizedData = sanitize(data);

        const validData = sanitizedData.filter((item) => {
            return Object.entries(validationRules).every(([key, rules]) => {
                const value = item[key];
                if (rules.required && !value) {
                    return false;
                }
                if (rules.numeric && isNaN(value)) {
                    return false;
                }
                return true;
            });
        });

        const savedStudents = await StudentModel.create(validData);

        // Procesar los datos para almacenarlos en TeacherModel
        const teacherData = savedStudents.map((student) => {
            return {
                CAMPUS: student.CAMPUS,
                DOCENTE: student.DOCENTE,
                CLAVES_MATERIAS: student.CLAVE_MATERIA,
                MATERIAS: student.MATERIA,
            };
        });

        const savedTeachers = await TeacherModel.create(teacherData);

        res.status(201).json({ message: 'File uploaded and students created', students: savedStudents, teachers: savedTeachers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
