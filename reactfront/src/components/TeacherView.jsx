import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import moon from '../assets/moonremovebg.png';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const URI = 'http://localhost:8000/home/teachers/teacher';

const TeacherView = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userInteracted, setUserInteracted] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [teacher, setTeacher] = useState(null);
    const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
    const [initials, setInitials] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [icon, setIcon] = useState('fa-solid fa-table-cells fa-lg');

    const obtenerMensajeCalificacion = (calificacion) => {
        if (calificacion <= 0) {
            return (
                <div className="my-8 card text-xl w-full shadow-2xl bg-base-100">
                    <div className="card-body">
                        <p className="text-2xl">Necesitas mejorar tu calificación promedio.
                            <span className="ml-4 text-xl">
                                Es importante que te tomes un tiempo para reflexionar sobre tus métodos de enseñanza y busques oportunidades para mejorar.
                            </span>
                        </p>
                        <p>Recuerda que cada retroalimentación de los alumnos es una oportunidad para crecer como educador.</p>
                        <p>No te desanimes y trabaja en fortalecer tus habilidades pedagógicas.</p>
                    </div>
                </div>
            );
        } else if (calificacion <= 2) {
            return (
                <div className="my-8 card text-xl w-full shadow-2xl bg-base-100">
                    <div className="card-body">
                        <p className="text-2xl">Es importante seguir esforzándote.
                            <span className="ml-4 text-xl">
                                Aunque la calificación promedio actual representa un desafío, no te rindas.
                            </span>
                        </p>
                        <p>Tómate el tiempo para analizar los comentarios de los alumnos y busca áreas específicas para mejorar.</p>
                        <p>Recuerda que el proceso de mejora es continuo, y cada paso hacia adelante es valioso en tu crecimiento como docente.</p>
                    </div>
                </div>
            );
        } else if (calificacion <= 4) {
            return (
                <div className="my-8 card text-xl w-full shadow-2xl bg-base-100">
                    <div className="card-body">
                        <p className="text-2xl">Vas por buen camino, ¡sigue así!
                            <span className="ml-4 text-xl">
                                Tu esfuerzo está dando frutos y los alumnos reconocen tu dedicación.
                            </span>
                        </p>
                        <p>Aprovecha los comentarios positivos y utiliza las sugerencias para seguir perfeccionando tus métodos de enseñanza.</p>
                        <p>Con persistencia y determinación, podrás alcanzar un mayor nivel de excelencia.</p>
                    </div>
                </div>
            );
        } else if (calificacion <= 6) {
            return (
                <div className="my-8 card text-xl w-full shadow-2xl bg-base-100">
                    <div className="card-body">
                        <p className="text-2xl">Tu calificación promedio es aceptable.
                            <span className="ml-4 text-xl">
                                Has logrado establecer una base sólida en tu enseñanza, pero siempre hay oportunidades para crecer y mejorar.
                            </span>
                        </p>
                        <p>Considera evaluar tu enfoque pedagógico, explorar nuevas estrategias y recursos educativos para aumentar el compromiso de los estudiantes y elevar su experiencia de aprendizaje.</p>
                    </div>
                </div>
            );
        } else if (calificacion <= 8) {
            return (
                <div className="my-8 card text-xl w-full shadow-2xl bg-base-100">
                    <div className="card-body">
                        <p className="text-2xl">¡Excelente trabajo!
                            <span className="ml-4 text-xl">
                                Tu calificación promedio es alta.
                            </span>
                        </p>
                        <p>Sigue así y mantén el enfoque en proporcionar una experiencia educativa enriquecedora para tus alumnos.</p>
                        <p>Continúa escuchando sus necesidades y adapta tus métodos para asegurarte de que sigan comprometidos y motivados en su aprendizaje.</p>
                    </div>
                </div>
            );
        } else if (calificacion <= 10) {
            return (
                <div className="my-8 card text-xl w-full shadow-2xl bg-base-100">
                    <div className="card-body">
                        <p className="text-2xl">¡Felicidades!
                            <span className="ml-4 text-xl">
                                Tienes la máxima calificación promedio.
                            </span>
                        </p>
                        <p>Es un logro impresionante y refleja tu dedicación y habilidades como docente.</p>
                        <p>Tu compromiso con la excelencia educativa es destacable.</p>
                        <p>Sigue siendo un modelo a seguir para tus alumnos y sigue buscando formas de innovar y enriquecer su experiencia educativa.</p>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    const toggleContent = () => {
        setShowTable((prevShowTable) => !prevShowTable);
        setIcon((prevIcon) =>
            prevIcon === 'fa-solid fa-table-cells fa-lg' ? 'fa-solid fa-chart-pie fa-lg' : 'fa-solid fa-table-cells fa-lg'
        );
    };


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

    const buttonStyle = {
        filter: (darkModeEnabled) ? 'invert(100%)' : 'none',
    };

    //Funcion que cierra la sesion
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    // Función para obtener la información del docente
    useEffect(() => {
        async function fetchTeacherData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(URI, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { Teacher } = response.data;

                const nameArray = Teacher.DOCENTE.split(' '); // Dividir el nombre en un array de palabras
                const initials = nameArray.map((word) => word.charAt(0)).join(''); // Obtener la primera letra de cada palabra y unirlas
                setInitials(initials);
                setTeacher(Teacher);
                setQuestionsAndAnswers(Teacher.QUESTIONS);
            } catch (error) {
                console.error(error);
            }
        }
        fetchTeacherData();
    }, []);

    // Actualizamos AnswerForm con las preguntas y respuestas del docente
    const AnswerForm = {
        labels: questionsAndAnswers.map((question) => question.question),
        datasets: [
            {
                label: 'Calificación Promedio',
                data: questionsAndAnswers.map((question) => question.answer),
                backgroundColor: '#a5b4fc',
                borderColor: '#d1d5db',
                borderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: 'Aspectos de la Evaluación',
            },
        },
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="btn btn-square loading"></div>
                </div>
            ) : (
                <div>
                    <div className="w-full navbar bg-base-100 border-b border-orange-600">
                        <div className="flex-1">
                            <label
                                htmlFor='info'
                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-info fa-lg"></i>
                            </label>
                            {/* Info */}
                            <input type="checkbox" id='info' className="modal-toggle" />
                            <div className="modal">
                                <div className="modal-box text-lg">
                                    <div className="modal-action">
                                        <label
                                            htmlFor='info'
                                            className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white">
                                            ✕
                                        </label>
                                    </div>
                                    <h3 className="font-semibold text-2xl">Querido docente,</h3>
                                    <br />
                                    <p>
                                        <span className="text-xl mr-4">¡Gracias por tu dedicación y compromiso en tu labor educativa!...</span>
                                        Valoramos mucho tu esfuerzo por brindar una enseñanza de calidad. Tu pasión por educar y guiar a nuestros estudiantes es inspiradora.</p>
                                    <br />
                                    <p>Esperamos que encuentres útiles las retroalimentaciones proporcionadas para continuar mejorando en tu práctica docente. Cada opinión y sugerencia son valiosas para tu desarrollo profesional.</p>
                                    <br />
                                    <p>Sigue siendo un agente de cambio en el proceso de aprendizaje de nuestros estudiantes. Tu dedicación y cuidado por su crecimiento académico y personal hacen una diferencia significativa en sus vidas.</p>
                                    <br />
                                    <p>Continuaremos trabajando juntos para brindar una educación de excelencia y formar líderes comprometidos con la sociedad.</p>
                                    <br />
                                    <p>¡Gracias por ser parte esencial de nuestra comunidad académica!</p>
                                    <br />
                                    <p className="font-semibold text-xl">Atentamente,</p>
                                    <p className="font-bold text-3xl">Universidad Tres Culturas</p>
                                </div>
                            </div>
                        </div>
                        <label className="btn btn-ghost swap swap-rotate mask mask-squircle hover:bg-orange-600 hover:text-white">
                            <input
                                type="checkbox"
                                checked={darkModeEnabled}
                                onChange={handleCheckboxChange}
                                disabled={!userInteracted} />
                            <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                            <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                        </label>
                        <button id="exit" className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white" onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i>
                        </button>
                    </div>
                    <div className="p-8 min-h-screen bg-base-200 md:grid md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2 flex-col">
                            <div className="flex items-center">
                                <button className="mr-8 btn btn-ghost mask mask-squircle bg-orange-500 h-20 w-20 flex items-center justify-center text-white text-3xl">
                                    {initials}
                                </button>
                                <h1 className="text-5xl font-bold">{teacher.DOCENTE}</h1>
                            </div>
                            <p className="my-4 text-2xl font-semibold">{teacher.CAMPUS}</p>
                            <div className="my-4 flex justify-between items-center">
                                <p className="text-2xl">
                                    Calificación Promedio:
                                    <span className="mx-8 text-3xl font-semibold">
                                        {teacher.CAL_PROM ?? "-"} / 10
                                    </span>
                                </p>
                                <div className="flex justify-end">
                                    <button
                                        className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                                        onClick={toggleContent}>
                                        <i className={icon}></i>
                                    </button>
                                </div>
                            </div>
                            {obtenerMensajeCalificacion(teacher.CAL_PROM)}
                        </div>
                        <div className="md:col-span-3 flex items-center justify-center">
                            {teacher.QUESTIONS.length > 0 ? (
                                <>
                                    {showTable ? (
                                        <div style={{ width: '90%', height: '90%' }}>
                                            <PolarArea data={AnswerForm} options={options} />
                                        </div>
                                    ) : (
                                        <div className="p-2 rounded-lg shadow-xl overflow-x-auto overflow-y-auto max-h-96">
                                            <table className="table ">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Pregunta</th>
                                                        <th className="text-center">Calificación Promedio</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {teacher.QUESTIONS.map((question, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{question.question}</td>
                                                            <td className="text-right">{question.answer}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <img src={moon} alt='moon' style={buttonStyle} />
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
        </>
    );
};

export default TeacherView;
