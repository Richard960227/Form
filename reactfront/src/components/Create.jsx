import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/form'

const Create = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [formId, setFormId] = useState(null);
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState({
        title: '',
        description: '',
        questions: [],
    });
    const [newQuestion, setNewQuestion] = useState({
        question: '',
        type: '',
        scale: {
            min: 0,
            max: 10,
            step: 1,
            start: 0,
            end: 10
        },
        options: [{ option: "" }],
        answer: null
    });
    const resetForm = () => {
        setSelectedForm({
            title: "",
            description: "",
            questions: [],
        });
        setNewQuestion({
            question: "",
            type: "",
            scale: {
                min: 0,
                max: 10,
                step: 1,
                start: 0,
                end: 10,
            },
            options: [{ option: "" }],
            answer: null
        });
    };
    const [showError, setShowError] = useState(false);
    const [mostrarIcono, setMostrarIcono] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [showMobile, setShowMobile] = useState(false);
    const [showDesktop, setShowDesktop] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleForm = () => {
        resetForm();
        setShowForm(!showForm);
        setMostrarIcono(!mostrarIcono);
        setShowQuestion(false);
        setShowDesktop(false);
        setShowMobile(false);
    };
    const toggleFormQuestion = () => {
        setShowQuestion(!showQuestion);
    };
    const toggleFormMobile = () => {
        setShowMobile(!showMobile);
        setShowDesktop(false);
    };
    const toggleFormDesktop = () => {
        setShowDesktop(!showDesktop);
        setShowMobile(false);
    };
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        setShowDesktop(false);
        setShowMobile(false);
    };
    const { id } = useParams();

    useEffect(() => {
        getForms();
    }, []);

    useEffect(() => {
        async function getFormById() {
            try {
                const response = await axios.get(`${URI}/${id}`);
                setSelectedForm(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        if (id) {
            getFormById();
        }
    }, [id]);

    async function getForms() {
        try {
            const response = await axios.get(URI);
            if (Array.isArray(response.data)) {
                setForms(response.data);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function createForm(e) {
        e.preventDefault();
        if (!selectedForm.title || !selectedForm.description) {
            setShowQuestion(false);
            setShowError(true);
            return;
        }
        try {
            const response = await axios.post(URI, selectedForm);
            setForms((forms) => [...forms, response.data]);
            setFormId(response.data.formId);
            setSelectedForm({
                title: '',
                description: '',
                questions: [],
            });
            setShowForm(false);
            setMostrarIcono(false);
            setShowError(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function addQuestion(e) {
        e.preventDefault();
        if (!newQuestion.question) {
            setShowError(true);
            return;
        }
        try {
            const response = await axios.post(`${URI}/${formId}/questions`, newQuestion);
            setSelectedForm(response.data);
            setNewQuestion({
                question: '',
                type: 'text',
                scale: {
                    min: 0,
                    max: 10,
                    step: 1,
                    start: 0,
                    end: 10,
                },
                options: [{
                    option: '',
                }],
                answer: null
            });
            setShowQuestion(true);
            setShowError(false);
        } catch (error) {
            console.error(error);
        }
    };

    function handleOptionChange(index, value) {
        const options = [...newQuestion.options];
        options[index] = { option: value };
        setNewQuestion({ ...newQuestion, options });
    }

    function addOption() {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, { option: "" }]
        });
    }

    function removeOption(index) {
        const options = [...newQuestion.options];
        options.splice(index, 1);
        setNewQuestion({ ...newQuestion, options });
    }

    const handleQuestionChange = (e) => {
        setNewQuestion({
            ...newQuestion,
            [e.target.name]: e.target.value
        });
    };

    async function updateQuestion(questionId, updatedQuestion) {
        try {
            const response = await axios.put(`${URI}/${formId}/questions/${questionId}`, updatedQuestion);
            setSelectedForm(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteQuestion(questionId) {
        try {
            const response = await axios.delete(`${URI}/${formId}/questions/${questionId}`);
            setSelectedForm(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    async function deleteAllQuestions() {
        try {
            const response = await axios.delete(`${URI}/${formId}/questions`);
            setSelectedForm(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="btn btn-square loading"></div>
                </div>
            ) : (
                <div className="h-screen bg-base-200 overflow-y-scroll">
                    <div className="flex items-center justify-between m-4">
                        {mostrarIcono ? (
                            <button className="btn btn-ghost mask mask-squircle" onClick={toggleForm}>
                                <i className="fa-light fa-plus fa-lg fa-2xl"></i>
                            </button>
                        ) : (
                            <button className="btn btn-ghost mask mask-squircle" onClick={() => { toggleForm(); setShowForm(false) }}>
                                <i className="fa-solid fa-check fa-2xl"></i>
                            </button>
                        )}
                        <div className="flex justify-end">
                            <h1 className="text-5xl font-bold m-2">Crear</h1>
                        </div>
                    </div>

                    {showForm && (
                        <form onSubmit={createForm}>
                            <div className="flex items-center justify-between m-4">
                                <input
                                    type="text"
                                    placeholder="Nombre del Formulario"
                                    className="input input-bordered w-full max-w-xs"
                                    value={selectedForm.title}
                                    onChange={(e) =>
                                        setSelectedForm({ ...selectedForm, title: e.target.value })
                                    }
                                />
                                <textarea
                                    className="textarea textarea-bordered textarea-xs w-full max-w-xs"
                                    placeholder="Descripción del Formulario"
                                    value={selectedForm.description}
                                    onChange={(e) =>
                                        setSelectedForm({ ...selectedForm, description: e.target.value })
                                    }
                                ></textarea>
                                <div className="flex items-center justify-end">
                                    <button
                                        className="btn btn-ghost mask mask-squircle"
                                        type="submit"
                                        onClick={toggleFormQuestion}>
                                        <i className="fa-solid fa-floppy-disk fa-2xl"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {showError ? (
                        <div className="alert alert-error shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Error! Completa los Campos Requeridos.</span>
                            </div>
                        </div>
                    ) : null}

                    {showQuestion && (
                        <div className="m-4">
                            <form onSubmit={addQuestion}>
                                <div className="flex items-center justify-between">
                                    <select
                                        id="type"
                                        name="type"
                                        className="select select-bordered w-full max-w-xs"
                                        value={newQuestion.type}
                                        onChange={handleQuestionChange}>
                                        <option defaultValue="">Tipo de Pregunta</option>
                                        <option value="text">Texto</option>
                                        <option value="scale">Escala</option>
                                        <option value="multiple-choice">Opción Multiple</option>
                                    </select>
                                    <div className="dropdown dropdown-end">
                                        <label
                                            tabIndex={0}
                                            className="btn btn-ghost"
                                            onClick={toggleDropdown}>
                                            <i className="fa-solid fa-eye fa-xl"></i>
                                        </label>
                                        {showDropdown && (
                                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-24 border border-orange-600">
                                            <li>
                                                <label htmlFor="desktop" className="btn btn-ghost" onClick={toggleFormDesktop}>
                                                    <i className="fa-solid fa-desktop fa-lg"></i>
                                                </label>
                                            </li>
                                            <li>
                                                <label htmlFor="mobile" className="btn btn-ghost" onClick={toggleFormMobile}>
                                                    <i className="fa-solid fa-mobile fa-lg"></i>
                                                </label>
                                            </li>
                                        </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center">
                                    <input
                                        id="question"
                                        name="question"
                                        type="text"
                                        placeholder="Escribe una Pregunta"
                                        className="input input-bordered w-full max-w-xs"
                                        value={newQuestion.question}
                                        onChange={handleQuestionChange} />
                                    <button
                                        className="btn btn-ghost mask mask-squircle"
                                        type="submit">
                                        <i className="fa-solid fa-arrow-right fa-lg"></i>
                                    </button>
                                </div>
                                {newQuestion.type === 'scale' && (
                                    <div className="m-2 md:block">
                                        <table className="table w-48 hidden md:table">
                                            <thead>
                                                <tr>
                                                    <th>Min</th>
                                                    <th>Max</th>
                                                    <th>Step</th>
                                                    <th>Start</th>
                                                    <th>End</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{newQuestion.scale.min}</td>
                                                    <td>{newQuestion.scale.max}</td>
                                                    <td>{newQuestion.scale.step}</td>
                                                    <td>{newQuestion.scale.start}</td>
                                                    <td>{newQuestion.scale.end}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {newQuestion.type === 'text' && (
                                    <div>
                                    </div>
                                )}
                                {newQuestion.type === "multiple-choice" && (
                                    <div className="m-2">
                                        {newQuestion.options && newQuestion.options.map((option, index) => (
                                            <div key={index} className="flex items-center ">
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost mask mask-squircle text-green-600"
                                                    onClick={addOption}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                                <input
                                                    type="text"
                                                    placeholder={`Opción ${index + 1}`}
                                                    className="input input-bordered w-full max-w-xs m-2"
                                                    value={option.option}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost mask mask-squircle text-red-600"
                                                    onClick={() => removeOption(index)}
                                                >
                                                    <i className="fa-solid fa-minus"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </form>
                            <div className="m-4 overflow-y-scroll max-h-96">
                                {selectedForm.questions.map((question, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-orange-600 py-4">
                                        <div>
                                            <p>{question.question}</p>
                                            <p className="font-bold">Tipo: {question.type}</p>
                                        </div>
                                        <div className="mr-2 flex justify-end">
                                            <label
                                                htmlFor={`updatequestion${question._id}`}
                                                className="btn btn-ghost mask mask-squircle">
                                                <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                            </label>
                                            <button
                                                onClick={() => deleteQuestion(question._id)}
                                                className="btn btn-ghost mask mask-squircle">
                                                <i className="fa-solid fa-trash fa-lg"></i>
                                            </button>
                                        </div>
                                        {/* Update */}
                                        <input type="checkbox" id={`updatequestion${question._id}`} className="modal-toggle" />
                                        <div className="modal">
                                            <div className="modal-box relative">
                                                <label
                                                    htmlFor={`updatequestion${question._id}`}
                                                    className="btn btn-ghost btn-circle hover:border-red-400 active:border-red-600 absolute right-2 top-2">
                                                    ✕
                                                </label>
                                                <div className="card-body">
                                                    <form onSubmit={(e) => { e.preventDefault(); updateQuestion(question._id, newQuestion); }}>
                                                        <div className="form-control">
                                                            <p className="card-title">Actualizar Usuario</p>
                                                            <label className="label">
                                                                <span className="label-text">Usuario</span>
                                                            </label>
                                                            <input
                                                                placeholder={question.question}
                                                                value={newQuestion.question}
                                                                className="input input-bordered"
                                                                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                                                type='text' />
                                                        </div>
                                                        <div className="form-control mt-6">
                                                            <button type='submit'
                                                                className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-400">Actualizar</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-end m-2">
                                    <p>Preguntas: {selectedForm.questions.length}</p>
                                    <button
                                        className="btn btn-ghost mask mask-squircle ml-2"
                                        onClick={deleteAllQuestions}>
                                        <i className="fa-solid fa-trash fa-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <input type="checkbox" id="desktop" className="modal-toggle" />
                    <div className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            {showDesktop && (
                                <div className="items-center">
                                    <div className="mockup-window border bg-base-300">
                                        <div className="m-4">
                                            <h1 className="text-5xl font-bold">{selectedForm.title}</h1>
                                            <p>{selectedForm.description}</p>
                                        </div>
                                        <div className="m-6 overflow-y-scroll max-h-96">
                                            {selectedForm.questions.map((question, index) => (
                                                <div key={index} className="border-b border-orange-600 py-4">
                                                    <div className="m-2">
                                                        <p>{question.question}</p>
                                                    </div>
                                                    {question.type === 'text' && (
                                                        <div className="m-2">
                                                            <input type="text" placeholder="Type here" className="input w-full max-w-xs" />
                                                        </div>
                                                    )}
                                                    {question.type === 'multiple-choice' && (
                                                        <div className="m-2">
                                                            {question.options.map((option, optionIndex) => (
                                                                <div key={optionIndex} className="flex items-center mb-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="checkbox mr-2" />
                                                                    <p>{option.option}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {question.type === 'scale' && (
                                                        <div className="m-2">
                                                            <input type="range" min={question.min} max={question.max} value={question.step} className="range" step={question.step} />
                                                            <div className="w-full flex justify-between text-xs px-2">
                                                                <span>{question.min}</span>
                                                                <span>|</span>
                                                                <span>|</span>
                                                                <span>|</span>
                                                                <span>|</span>
                                                                <span>|</span>
                                                                <span>{question.max}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="modal-action">
                                <label htmlFor="desktop" className="btn btn-ghost" onClick={toggleDropdown}>
                                    <i className="fa-solid fa-eye-slash"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                    <input type="checkbox" id="mobile" className="modal-toggle" />
                    <div className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            {showMobile && (
                                <div className="flex items-center">
                                    <div className="mockup-phone">
                                        <div className="camera"></div>
                                        <div className="display">
                                            <div className="artboard artboard-demo phone-1">
                                                <div className="m-4">
                                                    <h1 className="text-5xl font-bold">{selectedForm.title}</h1>
                                                    <p>{selectedForm.description}</p>
                                                </div>
                                                <div className="m-6 overflow-y-scroll max-h-96">
                                                    {selectedForm.questions.map((question, index) => (
                                                        <div key={index} className="border-b border-orange-600 py-4">
                                                            <div className="m-2">
                                                                <p>{question.question}</p>
                                                            </div>
                                                            {question.type === 'text' && (
                                                                <div className="m-2">
                                                                    <input type="text" placeholder="Type here" className="input w-full max-w-xs" />
                                                                </div>
                                                            )}
                                                            {question.type === 'multiple-choice' && (
                                                                <div className="m-2">
                                                                    {question.options.map((option, optionIndex) => (
                                                                        <div key={optionIndex} className="flex items-center mb-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox mr-2" />
                                                                            <p>{option.option}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {question.type === 'scale' && (
                                                                <div className="m-2">
                                                                    <input type="range" min={question.min} max={question.max} value={question.step} className="range" step={question.step} />
                                                                    <div className="w-full flex justify-between text-xs px-2">
                                                                        <span>{question.min}</span>
                                                                        <span>|</span>
                                                                        <span>|</span>
                                                                        <span>|</span>
                                                                        <span>|</span>
                                                                        <span>|</span>
                                                                        <span>{question.max}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="modal-action">
                                <label htmlFor="mobile" className="btn btn-ghost" onClick={toggleDropdown}>
                                    <i className="fa-solid fa-eye-slash"></i>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end m-2">
                        <p className="m-2">Formularios Realizados: {forms.length}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Create