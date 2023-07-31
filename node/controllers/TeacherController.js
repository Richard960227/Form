import TeacherModel from '../models/TeacherModel.js';
import jwt from 'jsonwebtoken';

export const getTeacherData = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, 'secret_key');
        const teacherId = decodedToken.userId;

        const teacher = await TeacherModel.findById(teacherId);

        const TeacherUnique = {
            CAMPUS: teacher.CAMPUS,
            DOCENTE: teacher.DOCENTE,
            CAL_PROM: teacher.CAL_PROM,
            QUESTIONS: teacher.QUESTIONS.map((question) => ({
                question: question.question,
                answer: question.answer,
            })),
        };

        res.status(200).json({ Teacher: TeacherUnique });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.find();

        // Objeto para almacenar las claves y materias de cada docente
        const teacherData = {};

        // Recorremos la lista de docentes para unificar las claves, materias, preguntas y respuestas
        teachers.forEach((teacher) => {
            const { CAMPUS, DOCENTE, CLAVES_MATERIAS, MATERIAS, CAL_PROM, QUESTIONS } = teacher;

            // Si el docente ya existe en el objeto, actualizamos las claves, materias, preguntas y respuestas
            if (teacherData.hasOwnProperty(DOCENTE)) {
                const existingData = teacherData[DOCENTE];

                // Unificamos las claves de materia
                CLAVES_MATERIAS.forEach((clave) => {
                    if (!existingData.CLAVES_MATERIAS.includes(clave)) {
                        existingData.CLAVES_MATERIAS.push(clave);
                    }
                });

                // Unificamos las materias en función de las claves de materia
                for (let i = 0; i < CLAVES_MATERIAS.length; i++) {
                    const claveMateria = CLAVES_MATERIAS[i];
                    const materia = MATERIAS[i];
                    if (!existingData.MATERIAS[claveMateria]) {
                        existingData.MATERIAS[claveMateria] = [];
                    }
                    if (!existingData.MATERIAS[claveMateria].includes(materia)) {
                        existingData.MATERIAS[claveMateria].push(materia);
                    }
                }

                // Incluimos las preguntas y respuestas en el objeto del docente
                existingData.QUESTIONS = QUESTIONS.map((question) => ({
                    question: question.question,
                    answer: question.answer,
                }));
            } else {
                // Si el docente no existe en el objeto, creamos una nueva entrada con las claves, materias, preguntas y respuestas
                const materiasByClave = {};
                CLAVES_MATERIAS.forEach((clave) => {
                    materiasByClave[clave] = [];
                });

                for (let i = 0; i < CLAVES_MATERIAS.length; i++) {
                    const claveMateria = CLAVES_MATERIAS[i];
                    const materia = MATERIAS[i];
                    materiasByClave[claveMateria].push(materia);
                }

                teacherData[DOCENTE] = {
                    CAMPUS,
                    DOCENTE,
                    CAL_PROM,
                    CLAVES_MATERIAS: [...CLAVES_MATERIAS],
                    MATERIAS: materiasByClave,
                    QUESTIONS: QUESTIONS.map((question) => ({
                        question: question.question,
                        answer: question.answer,
                    })),
                };
            }
        });

        // Convertimos el objeto en un arreglo con la información unificada de cada docente
        const uniqueTeachers = Object.values(teacherData);

        res.status(200).json(uniqueTeachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


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

// Función para guardar la calificación promedio del docente
export const saveTeacherRating = async (req, res) => {
    const { teacher, rating, questionRatings } = req.body;

    try {
        // Verificar si el docente existe en la base de datos por su campo DOCENTE
        const existingTeacher = await TeacherModel.findOne({ DOCENTE: teacher });
        if (!existingTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Actualizar la calificación promedio del docente en la base de datos
        existingTeacher.CAL_PROM = rating;
        existingTeacher.QUESTIONS = questionRatings;
        await existingTeacher.save();

        res.status(200).json({ message: 'Teacher rating updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const saveTeachersRatings = async (req, res) => {
    const { ratings } = req.body;

    try {
        for (const rating of ratings) {
            const { teacher, rating: averageRating, questionRatings, answers } = rating;

            const existingTeacher = await TeacherModel.findOne({ DOCENTE: teacher });
            if (!existingTeacher) {
                continue;
            }

            existingTeacher.CAL_PROM = averageRating;
            existingTeacher.QUESTIONS = questionRatings;

            // Update the teacher's answers in the database
            existingTeacher.QUESTIONS.forEach((question, index) => {
                question.answer = answers[index].answer;
            });

            await existingTeacher.save();
        }

        res.status(200).json({ message: 'Teachers ratings and answers updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

