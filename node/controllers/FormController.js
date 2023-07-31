import { FormModel, SelectedFormModel } from '../models/FormModel.js';
import StudentModel from '../models/StudentModel.js';
import nodemailer from 'nodemailer';
import Queue from 'queue-promise';

// Obtener todos los formularios
export const getAllForms = async (req, res) => {
    try {
        const forms = await FormModel.find();
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Obtener formulario por Id
export const getForm = async (req, res) => {
    const { id } = req.params;

    try {
        const form = await FormModel.findById(id);
        if (form) {
            res.status(200).json(form);
        } else {
            res.status(404).json({ message: 'Form not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Crear un nuevo formulario
export const createForm = async (req, res) => {
    const newForm = new FormModel(req.body);

    try {
        const savedForm = await newForm.save();
        res.status(200).json({ formId: savedForm._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal serever error' });
    }
}

// Actualizar un formulario existente
export const updateForm = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedForm = await FormModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, }
        );
        if (updatedForm) {
            res.status(200).json(updatedForm);
        } else {
            res.status(404).json({ message: 'Form not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Eliminar un formulario existente
export const deleteForm = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedForm = await FormModel.findByIdAndDelete(id);
        if (deletedForm) {
            res.json({ message: 'Formulario eliminado' });
        } else {
            res.status(404).json({ message: 'Form not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Eliminar todos los formularios
export const deleteAllForms = async (req, res) => {
    try {
        const result = await FormModel.deleteMany({});
        res.json({ message: `${result.deletedCount} formularios eliminados` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Obtener todas las preguntas
export const getQuestions = async (req, res) => {
    const { id } = req.params;

    try {
        const form = await FormModel.findById(id);
        if (form) {
            const questions = form.questions;
            res.status(200).json(questions);
        } else {
            res.status(404).json({ message: 'Form not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Crear una nueva pregunta
export const addQuestion = async (req, res) => {
    const { id } = req.params;
    const { question, type, scale, options, answer } = req.body;

    try {
        const form = await FormModel.findById(id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const newQuestion = { question, type, scale, options, answer };
        form.questions.push(newQuestion);

        const updatedForm = await form.save();
        res.status(200).json(updatedForm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Actualizar una pregunta
export const updateQuestion = async (req, res) => {
    const { formId, questionId } = req.params;
    const updatedQuestion = req.body;

    try {
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const questionIndex = form.questions.findIndex((question) => question._id.toString() === questionId);
        if (questionIndex < 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        form.questions[questionIndex] = updatedQuestion;
        const updatedForm = await form.save();

        res.status(200).json(updatedForm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Eliminar una pregunta
export const deleteQuestion = async (req, res) => {
    const { formId, questionId } = req.params;

    try {
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const questionIndex = form.questions.findIndex((question) => question._id.toString() === questionId);
        if (questionIndex < 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        form.questions.splice(questionIndex, 1);
        const updatedForm = await form.save();

        res.status(200).json(updatedForm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Eliminar todas las preguntas
export const deleteAllQuestions = async (req, res) => {
    const { formId } = req.params;

    try {
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        form.questions = [];
        const updatedForm = await form.save();

        res.status(200).json(updatedForm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Guardar formulario para responder 
export const FormSelect = async (req, res) => {
    try {
        const { formId } = req.params;

        // Eliminar el formulario existente por su ID
        await SelectedFormModel.deleteMany({});

        // Buscar el formulario por su ID
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        }

        const formContent = form.toObject(); // Obtener el contenido del formulario

        // Guardar el formulario en la base de datos
        const newForm = new SelectedFormModel({ ...formContent });
        await newForm.save();

        res.status(200).json({ message: 'Formulario almacenado exitosamente' });
    } catch (error) {
        console.error('Error al almacenar el formulario:', error);
        res.status(500).json({ error: 'Error al almacenar el formulario' });
    }
};

// Mostrar formulario para responder
export const getSelectedForm = async (req, res) => {
    try {
        const selectedForm = await SelectedFormModel.findOne();
        res.status(200).json(selectedForm);
    } catch (error) {
        res.status(500).json({ message: 'Error al mostrar formualrio' });
    }
};

// Obtener todos los formularios respondidos
export const getAllFormsAnswers = async (req, res) => {
    try {
        const selectedForms = await SelectedFormModel.find().skip(1);
        res.status(200).json(selectedForms);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los formularios' });
    }
};

// Guardar respuestas del formulario
export const saveFormResponses = async (req, res) => {
    const { formId } = req.params;
    const { answers } = req.body;

    try {
        const form = await FormModel.findById(formId);

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const selectedForm = new SelectedFormModel({
            title: form.title,
            description: form.description,
            questions: form.questions.map((question, index) => {
                const { type } = question;
                let answer;

                switch (type) {
                    case 'text':
                        answer = answers[index];
                        break;
                    case 'scale':
                        answer = parseFloat(answers[index]);
                        break;
                    case 'multiple-choice':
                        const selectedOptionsIndexes = answers[index] || [];
                        const selectedOptions = selectedOptionsIndexes.map((optionIndex) => {
                            return question.options[optionIndex]?.option || null;
                        });
                        answer = selectedOptions.length > 0 ? selectedOptions : null;
                        break;
                    default:
                        answer = null;
                        break;
                }

                return {
                    question: question.question,
                    type: question.type,
                    scale: question.scale,
                    options: question.options,
                    answer: answer,
                };
            }),
        });
        selectedForm.teacher = req.body.teacher;
        selectedForm.campus = req.body.campus;
        selectedForm.nivel = req.body.nivel;
        selectedForm.bloque = req.body.bloque;
        selectedForm.programa = req.body.programa;
        selectedForm.matricula = req.body.matricula;
        await selectedForm.save();
        res.status(200).json({ message: 'Form saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving form responses' });
    }
};

// Crear una cola de envío de correos electrónicos
const emailQueue = new Queue({
    concurrency: 5, // Establecer el número máximo de conexiones simultáneas permitidas
});

// Crear un trabajo para enviar correos electrónicos
export const sendFormToStudents = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el formulario por su ID
        const form = await FormModel.findById(id);
        if (!form) {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        }

        // Obtener estudiantes con correo_pref definido
        const students = await StudentModel.find({ CORREO_PREF: { $exists: true } });
        if (students.length === 0) {
            return res.status(404).json({ message: 'No se encontraron estudiantes con correo_pref definido' });
        }

        // Enviar el formulario a los estudiantes
        const promises = students.map(async (student) => {
            // Agregar el envío del correo electrónico a la cola
            return emailQueue.add(() => sendEmailToStudent(student.CORREO_PREF, form));
        });

        await Promise.all(promises);

        return res.status(200).json({ message: 'Formulario enviado exitosamente a los estudiantes' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función para enviar un correo electrónico al estudiante con el formulario adjunto
const sendEmailToStudent = async (email, form) => {
    // Configurar el transportador de correo electrónico utilizando Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'dears_ricardo@hotmail.com',
            pass: 'dearsricardo',
        },
    });

    const formURL = `https://tudominio.com/formulario/${form.id}`;

    // Configurar el contenido del correo electrónico
    const mailOptions = {
        from: 'dears_ricardo@hotmail.com',
        to: email,
        subject: 'Caso Omiso',
        html: `Estimado estudiante, puedes acceder al formulario <a href="${formURL}">aquí</a>`,
    };

    try {
        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('Error al enviar el correo electrónico');
    }
};