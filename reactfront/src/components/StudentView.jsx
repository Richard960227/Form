import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Footer from './Footer';

const URI = 'http://localhost:8000/home/students';
const URIForm = 'http://localhost:8000/home/form/select';

const StudentView = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userInteracted, setUserInteracted] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [progress, setProgress] = useState(0);
    const [initials, setInitials] = useState(null);
    const [form, setForm] = useState({});
    const [formData, setFormData] = useState({
        answers: [],
        selectedOptions: [],
        selectedDocente: ''
    });
    const [studentData, setStudentData] = useState({});
    const [docentes, setDocentes] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [evaluatedDocentes, setEvaluatedDocentes] = useState([]);
    const [showComplete, setShowComplete] = useState(false);
    const [showForm, setShowForm] = useState(true)
    const availableDocentes = docentes.filter((docente) => !evaluatedDocentes.includes(docente));

    // Función que finaliza la carga después de 3 segundos
    setTimeout(() => {
        setIsLoading(false);
    }, 3000);

    // Función que cambia el tema
    useEffect(() => {
        window.addEventListener('change', () => {
            setUserInteracted(true);
        });
        return () => {
            window.removeEventListener('change', () => {
                setUserInteracted(true);
            });
        };
    }, []);

    // Función que cambia el tema
    const handleCheckboxChange = (event) => {
        if (!userInteracted) {
            return;
        }

        const htmlElement = document.querySelector('html');
        if (event.target.checked) {
            htmlElement.setAttribute('data-theme', 'dark');
            setDarkModeEnabled(true);
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            setDarkModeEnabled(false);
        }
    };

    //Funcion que cierra la sesion
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    // Función que carga el formulario
    useEffect(() => {
        async function getSelectedForm() {
            try {
                const response = await axios.get(`${URIForm}/response`);
                setForm(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        getSelectedForm();
    }, []);

    const calculateProgress = () => {
        const totalQuestions = form.questions.length + 1;
        let answeredQuestions = 1;

        if (formData.selectedDocente !== '') {
            answeredQuestions++;
        }

        form.questions.forEach((question, questionIndex) => {
            const questionType = question.type;
            const answer = formData.answers[questionIndex];

            switch (questionType) {
                case 'text':
                    if (answer !== undefined && answer !== '') {
                        answeredQuestions++;
                    }
                    break;
                case 'scale':
                    if (answer >= question.scale.min) {
                        answeredQuestions++;
                    }
                    break;
                case 'multiple-choice':
                    const options = question.options;
                    const selectedOptions = answer || [];
                    if (selectedOptions.length > 0 && selectedOptions.length <= options.length) {
                        answeredQuestions++;
                    }
                    break;
                default:
                    break;
            }
        });

        const limitedAnsweredQuestions = Math.min(answeredQuestions, totalQuestions);
        const calculatedProgress = (((limitedAnsweredQuestions) / (totalQuestions)) * 100).toFixed(2);

        return calculatedProgress;
    };


    const handleAnswerChange = (event, questionIndex) => {
        const { type, value, checked } = event.target;
        let updatedAnswers = [...formData.answers];

        switch (type) {
            case 'text':
                updatedAnswers[questionIndex] = value;
                break;
            case 'checkbox':
                const selectedOptions = formData.answers[questionIndex] || []; // Obtener las opciones seleccionadas previas si existen
                const optionValue = parseInt(value); // Convertir el valor a número
                if (checked) {
                    updatedAnswers[questionIndex] = [...selectedOptions, optionValue];
                } else {
                    updatedAnswers[questionIndex] = selectedOptions.filter((option) => option !== optionValue);
                }
                break;
            case 'range':
                updatedAnswers[questionIndex] = parseInt(value);
                break;
            default:
                break;
        }

        setFormData((prevData) => ({
            ...prevData,
            answers: updatedAnswers,
        }));

        const calculatedProgress = calculateProgress();
        setShowSubmitButton(calculatedProgress >= 100);
        setProgress(calculatedProgress);
        setUserInteracted(true);
    };

    const resetForm = () => {
        setFormData((prevData) => ({
            ...prevData,
            answers: [],
            selectedOptions: [],
            selectedDocente: ''
        }));
        setProgress(calculateProgress());
    };

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const formattedAnswers = formData.answers.map((answer, index) => {
                const question = form.questions[index];
                switch (question.type) {
                    case 'scale':
                    case 'text':
                        return answer;
                    case 'multiple-choice':
                        const selectedOptionsIndexes = answer || [];
                        const selectedOptions = selectedOptionsIndexes.map((optionIndex) => {
                            return optionIndex.toString();
                        });
                        return selectedOptions.length > 0 ? selectedOptions : null;
                    default:
                        return answer;
                }
            });
            await axios.post(`${URIForm}/${form._id}/responses`, {
                answers: formattedAnswers,
                teacher: formData.selectedDocente,
            });

            setEvaluatedDocentes((prevEvaluatedDocentes) => [...prevEvaluatedDocentes, formData.selectedDocente]);

            setShowSubmitButton(false);
            resetForm();
            setProgress(true);
        } catch (error) {
            console.error(error);
        }
    }


    //Funcion que carga el estudiante
    useEffect(() => {
        async function fetchStudentData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URI}/student`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { Student } = response.data;
                setStudentData(Student);

                // Obtener todos los docentes asociados a las materias del estudiante
                const docentes = Student.DOCENTES;
                setDocentes(docentes);

                // Crear un array de materias con el mismo orden que las claves de materias
                const materias = Student.MATERIAS;
                setMaterias(materias);

                const nameArray = Student.ALUMNO.split(' '); // Dividir el nombre en un array de palabras
                const initials = nameArray.map((word) => word.charAt(0)).join(''); // Obtener la primera letra de cada palabra y unirlas
                setInitials(initials);
            } catch (error) {
                console.error(error);
            }
        }
        fetchStudentData();
    }, []);

    // Verificar si todos los docentes han sido evaluados
    useEffect(() => {
        if (evaluatedDocentes.length === docentes.length) {
        }
    }, [evaluatedDocentes, docentes]);

    // Verificar si todos los docentes han sido evaluados
    useEffect(() => {
        if (evaluatedDocentes.length === docentes.length) {
            setShowComplete(true);
            setShowForm(false);
        } else {
            setShowComplete(false);
            setShowForm(true);
        }
    }, [evaluatedDocentes, docentes]);

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="btn btn-square loading"></div>
                </div>
            ) : (
                <div className="drawer text-sm">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        <div className="w-full navbar bg-base-100 border-b border-orange-600">
                            <div className="flex-none">
                                <label htmlFor="my-drawer-3" className="btn btn-ghost mask mask-squircle bg-orange-500 h-10 w-10 flex items-center justify-center text-white hover:bg-orange-600">
                                    {initials}
                                </label>
                            </div>
                            <div className="flex-1 px-2 mx-2 lg:hidden">
                                <h1 className="text-lg font-bold">{form.title}</h1>
                            </div>
                            <div className="flex-1 px-2 mx-2 hidden lg:block">
                                <h1 className="text-3xl font-bold">{form.title}</h1>
                            </div>
                            <label
                                htmlFor='info'
                                className="btn btn-ghost mask mask-squircle">
                                <i className="fa-solid fa-info fa-lg"></i>
                            </label>
                            {/* Info */}
                            <input type="checkbox" id='info' className="modal-toggle" />
                            <div className="modal">
                                <div className="modal-box relative">
                                    <label
                                        htmlFor='info'
                                        className="btn btn-ghost mask mask-squircle absolute right-2 top-2">
                                        ✕
                                    </label>
                                    <h3 className="font-semibold text-xl">Querido alumno,</h3>
                                    <br />
                                    <p>
                                        <span className="text-lg">¡Tu participación es fundamental!... </span>
                                        Al responder correctamente este formulario, estás contribuyendo a evaluar a tus docentes de manera precisa y justa.
                                        Recuerda que tu opinión y retroalimentación son valiosas para mejorar la calidad educativa.
                                    </p>
                                    <br />
                                    <p>Tómate el tiempo necesario para reflexionar sobre cada pregunta y proporcionar respuestas honestas. Tu compromiso en este proceso garantiza que se tomen decisiones informadas para el beneficio de todos.</p>
                                    <br />
                                    <p>Recuerda que evaluar a tus docentes de manera adecuada fomenta un ambiente de aprendizaje de calidad y permite que se reconozca y mejore su labor. ¡Tu participación marca la diferencia!</p>
                                    <br />
                                    <p>¡Gracias por tu colaboración!</p>
                                    <br />
                                    <p>Atentamente,</p>
                                    <p className="font-semibold text-2xl">Universidad Tres Culturas</p>
                                </div>
                            </div>
                        </div>
                        <div className="hero min-h-screen bg-base-200">
                            {showForm && (
                                <div className="card bg-base-100 shadow-xl overflow-x-auto">
                                    <form className="card-body" onSubmit={handleSubmit}>
                                        <p>{form.description}</p>
                                        <div className="m-2 flex items-center justify-between">
                                            <select
                                                className="select select-bordered w-full max-w-xs"
                                                value={formData.selectedDocente}
                                                onChange={(e) =>
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        selectedDocente: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">Selecciona un Docente...</option>
                                                {availableDocentes.map((docente) => (
                                                    <option key={docente} value={docente}>
                                                        {docente}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="flex justify-end">
                                                {availableDocentes.length > 0 ? (
                                                    showSubmitButton ? (
                                                        <button type="submit" className="btn btn-ghost mask mask-squircle">
                                                            <i className="fa-solid fa-paper-plane fa-xl"></i>
                                                        </button>
                                                    ) : (
                                                        <div className="radial-progress text-sm" style={{ "--value": progress }}>
                                                            {progress}%
                                                        </div>
                                                    )
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="h-96 overflow-y-scroll">
                                            {form.questions && form.questions.map((question, index) => (
                                                <div key={index} className="m-2 border-b border-orange-600">
                                                    <p className="text-lg">{question.question}</p>
                                                    {question.type === 'text' && (
                                                        <div className="m-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Escribe tu respuesta..."
                                                                className="input input-bordered w-full max-w-xs"
                                                                value={formData.answers[index] || ''}
                                                                onChange={(event) => handleAnswerChange(event, index)} />
                                                        </div>
                                                    )}
                                                    {question.type === 'multiple-choice' && (
                                                        <div className="m-2">
                                                            {question.options.map((option, optionIndex) => (
                                                                <div key={optionIndex} className="flex items-center mb-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="checkbox mr-2"
                                                                        name={`question_${index}_${optionIndex}`}
                                                                        value={optionIndex}
                                                                        checked={(formData.answers[index] || []).includes(optionIndex)}
                                                                        onChange={(event) => handleAnswerChange(event, index)} />
                                                                    <p>{option.option}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {question.type === 'scale' && (
                                                        <div className="m-2 w-full max-w-xs">
                                                            <input
                                                                type="range"
                                                                min={question.scale.min}
                                                                max={question.scale.max}
                                                                value={formData.answers[index] || question.scale.min}
                                                                className="range"
                                                                step={question.scale.step}
                                                                onChange={(event) => handleAnswerChange(event, index)} />
                                                            <div className="w-full flex justify-between text-xs px-2">
                                                                <span>{question.scale.min}</span>
                                                                <span>1</span>
                                                                <span>2</span>
                                                                <span>3</span>
                                                                <span>4</span>
                                                                <span>5</span>
                                                                <span>6</span>
                                                                <span>7</span>
                                                                <span>8</span>
                                                                <span>9</span>
                                                                <span>{question.scale.max}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </form>
                                </div>
                            )}
                            {showComplete && (
                                <div className="hero-content w-96 alert alert-success shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Todos los docentes han sido evaluados!


                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Footer />
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 bg-base-100">
                            <p>Plantel:</p>
                            <li className="ml-4 mb-2">{studentData.CAMPUS}</li>
                            <p>Carrera:</p>
                            <li className="ml-4 mb-2">{studentData.PROGRAMA}</li>
                            <li className="bg-orange-600 mt-4 mb-4"></li>
                            <p className="mt-2">Alumno:</p>
                            <li className="ml-4 mb-2">{studentData.ALUMNO}</li>
                            <p>Matricula:</p>
                            <li className="ml-4 mb-2">{studentData.MATRICULA}</li>
                            <p>Correo Institucional:</p>
                            <li className="ml-4 mb-2">{studentData.CORREO_PREF}</li>
                            <li className="bg-orange-600 mt-4 mb-4"></li>
                            <p className="mt-2">Grupo:</p>
                            <li className="ml-4 mb-2">{studentData.BLOQUE}</li>
                            <p>Cursos:</p>
                            {materias.map((materia) => (
                                <li key={materia} className="ml-4 mb-2">
                                    {materia}
                                </li>
                            ))}
                            <li className="bg-orange-600 mt-4 mb-4"></li>
                            <div className="flex justify-end">
                                <label className="btn btn-ghost swap swap-rotate mask mask-squircle">
                                    <input
                                        type="checkbox"
                                        checked={darkModeEnabled}
                                        onChange={handleCheckboxChange}
                                        disabled={!userInteracted} />
                                    <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                                    <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                                </label>
                                <button id="exit" className="btn btn-ghost mask mask-squircle" onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket fa-lg"></i>
                                </button>
                            </div>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentView;
