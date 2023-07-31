import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/form'

const Create = () => {
    const [isLoading, setIsLoading] = useState(true);
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
            end: 10,
        },
        options: [{ option: '' }],
        answer: null,
    });
    const [editedQuestions, setEditedQuestions] = useState([]);
    const [showError, setShowError] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const handleCheckboxChange = () => {
        setIsActive(!isActive);
        setShowForm(!showForm);
        resetFields();
    };
    const [showDesktop, setShowDesktop] = useState(false);
    const [showMobile, setShowMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
    const [showShareForm, setShowShareForm] = useState(false);
    const [formToShare, setFormToShare] = useState(null);
    const [formToDelete, setFormToDelete] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        getForms();
    }, []);

    useEffect(() => {
        async function getFormById() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URI}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
            const token = localStorage.getItem('token');
            const response = await axios.get(URI, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (Array.isArray(response.data)) {
                setForms(response.data);
                setFiltered(response.data);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateConfirm(e) {
        e.preventDefault();
        setShowError(false);
        setShowCreateConfirmation(true);
    }

    async function createForm(e) {
        e.preventDefault();
        if (!selectedForm.title || !selectedForm.description || selectedForm.questions.length === 0) {
            setShowCreateConfirmation(false);
            setShowError(true);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(URI, selectedForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const form = response.data;
            const updatedQuestions = Array.isArray(form.questions) ? [...form.questions, newQuestion] : [newQuestion];
            const updatedForm = {
                ...form,
                questions: updatedQuestions,
            };
            const updatedForms = [...forms, updatedForm];
            setForms(updatedForms);
            getForms();
            setShowError(false);
            handleCheckboxChange();
            setShowCreateConfirmation(false);
        } catch (error) {
            console.error(error);
        }
    }

    const addQuestion = () => {
        if (
            newQuestion.type !== '' &&
            newQuestion.question !== '' &&
            (newQuestion.type !== 'multiple-choice' || newQuestion.options.length > 0)
        ) {
            try {
                setSelectedForm((prevForm) => ({
                    ...prevForm,
                    questions: [...prevForm.questions, newQuestion],
                }));
                setNewQuestion({
                    type: '',
                    question: '',
                    options: [],
                    scale: {
                        min: 0,
                        max: 10,
                        step: 1,
                        start: 0,
                        end: 10,
                    },
                    answer: null,
                });
                setShowError(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            setShowError(true);
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
            options: [...newQuestion.options, { option: '' }],
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
            [e.target.name]: e.target.value,
        });
    };

    const handleEditedQuestionChange = (index, value) => {
        setEditedQuestions((prevEditedQuestions) => {
            const updatedQuestions = [...prevEditedQuestions];
            const editedQuestion = { ...updatedQuestions[index] };
            editedQuestion.question = value;
            updatedQuestions[index] = editedQuestion;
            return updatedQuestions;
        });
    };

    const handleEditedQuestionTypeChange = (index, value) => {
        setEditedQuestions((prevEditedQuestions) => {
            const updatedQuestions = [...prevEditedQuestions];
            const editedQuestion = { ...updatedQuestions[index] };
            editedQuestion.type = value;
            editedQuestion.options = value === 'multiple-choice' ? [{ option: '' }] : [];
            updatedQuestions[index] = editedQuestion;
            return updatedQuestions;
        });
    };

    const handleEditedOptionChange = (questionIndex, optionIndex, value) => {
        setEditedQuestions((prevEditedQuestions) => {
            const updatedQuestions = [...prevEditedQuestions];
            const editedQuestion = { ...updatedQuestions[questionIndex] };
            const updatedOptions = [...editedQuestion.options];
            updatedOptions[optionIndex] = { option: value };
            editedQuestion.options = updatedOptions;
            updatedQuestions[questionIndex] = editedQuestion;
            return updatedQuestions;
        });
    };

    const addEditedOption = (questionIndex) => {
        setEditedQuestions((prevEditedQuestions) => {
            const updatedQuestions = [...prevEditedQuestions];
            const editedQuestion = { ...updatedQuestions[questionIndex] };
            editedQuestion.options = [...editedQuestion.options, { option: '' }];
            updatedQuestions[questionIndex] = editedQuestion;
            return updatedQuestions;
        });
    };

    const removeEditedOption = (questionIndex, optionIndex) => {
        setEditedQuestions((prevEditedQuestions) => {
            const updatedQuestions = [...prevEditedQuestions];
            const editedQuestion = { ...updatedQuestions[questionIndex] };
            const updatedOptions = [...editedQuestion.options];
            updatedOptions.splice(optionIndex, 1);
            editedQuestion.options = updatedOptions;
            updatedQuestions[questionIndex] = editedQuestion;
            return updatedQuestions;
        });
    };

    const updateQuestion = (index, updatedQuestion) => {
        setSelectedForm((prevForm) => {
            const updatedQuestions = [...prevForm.questions];
            updatedQuestions[index] = updatedQuestion;
            const updatedForm = { ...prevForm, questions: updatedQuestions };
            return updatedForm;
        });
        document.getElementById(`updatequestion-${index}`).checked = false;
    };

    const editQuestion = (index) => {
        const questionToEdit = selectedForm.questions[index];
        setEditedQuestions((prevEditedQuestions) => {
            const updatedEditedQuestions = [...prevEditedQuestions];
            updatedEditedQuestions[index] = { ...questionToEdit };
            return updatedEditedQuestions;
        });
    };

    const removeQuestion = (index) => {
        setSelectedForm((prevForm) => {
            const questions = [...prevForm.questions];
            questions.splice(index, 1);
            return { ...prevForm, questions };
        });
    };

    const removeAllQuestions = () => {
        setSelectedForm((prevForm) => ({
            ...prevForm,
            questions: [],
        }));
    };

    async function updateQuestionForm(formId, questionId, updatedQuestion) {
        try {
            const token = localStorage.getItem('token');
            if (!updatedQuestion.type || updatedQuestion.type === '') {
                const currentQuestion = await axios.get(`${URI}/${formId}/questions/${questionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                updatedQuestion.type = currentQuestion.data.type;
            }
            const response = await axios.put(
                `${URI}/${formId}/questions/${questionId}`,
                updatedQuestion, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setSelectedForm(response.data);
            getForms(formId);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteQuestionForm(e, formId, questionId) {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${URI}/${formId}/questions/${questionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setSelectedForm(response.data);
            getForms(formId);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteAllQuestionsForm(e, formId) {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${URI}/${formId}/questions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedForm(response.data);
            getForms(formId);
        } catch (error) {
            console.error(error);
        }
    }

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

    async function updateForm(id, form) {
        try {
            const token = localStorage.getItem('token');
            // Obtener los datos actuales del formulario antes de la actualización
            const currentForm = await axios.get(`${URI}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedForm = { ...currentForm.data, ...form }; // Combinar los datos actuales con los nuevos datos proporcionados

            // Reemplazar campos vacíos en el objeto updatedUser con los valores actuales del usuario
            if (!updatedForm.title || updatedForm.title === '') {
                updatedForm.title = currentForm.data.title;
            }
            if (!updatedForm.description || updatedForm.description === '') {
                updatedForm.description = currentForm.data.description;
            }
            if (!updatedForm.questions || updatedForm.questions.length === 0) {
                updatedForm.questions = currentForm.data.questions;
            }

            const response = await axios.put(`${URI}/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setForms((forms) =>
                forms.map((form) => (form._id === id ? response.data : form))
            );
            document.getElementById(`updateform${id}`).checked = false;
            getForms();
        } catch (error) {
            console.error(error);
        }
    }

    function handleDeleteConfirmation(id) {
        setFormToDelete(id);
        setShowConfirmation(true);
    }

    async function deleteForm(id) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${URI}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setForms((forms) => forms.filter((form) => form._id !== id));
            getForms();
        } catch (error) {
            console.error(error);
        }
    }

    async function deletedAllForms() {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(URI, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setForms([]);
            getForms();
        } catch (error) {
            console.error(error);
        }
    }

    function handleShareForm(formId) {
        setFormToShare(formId);
        setShowShareForm(true);
    }

    async function shareForm() {
        try {
            const token = localStorage.getItem('token');
            const responsedelete = await axios.delete(`${URI}/select/${formToShare}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responsepost = await axios.post(`${URI}/select/${formToShare}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (responsedelete.status === 200 && responsepost.status === 200) {
                setShowShareForm(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /*
    async function sendFormToStudents(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${URI}/${id}/send`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log('Formulario enviado exitosamente a los estudiantes');
            } else {
                console.log('Error al enviar el formulario');
            }
        } catch (error) {
            console.error('Error al enviar el formulario', error);
        }
    }
    */

    async function SearchTermChange(event) {
        try {
            const value = event.target.value;
            const searchTerm = typeof value === 'string' ? value.toLowerCase() : value;

            setSearchTerm(searchTerm);

            const filtered = forms.filter((form) =>
                form.title.toLowerCase().includes(searchTerm)
            );
            setFiltered(filtered);

            setFiltered(filtered);
        } catch (error) {
            console.error(error);
        }
    }

    async function SearchReset() {
        try {
            setSearchTerm('');
            setFiltered(forms);
        } catch (error) {
            console.error(error);
        }
    }

    const resetFields = () => {
        setSelectedForm({
            title: '',
            description: '',
            questions: [],
        });
        setNewQuestion({
            question: '',
            type: '',
            scale: {
                min: 0,
                max: 10,
                step: 1,
                start: 0,
                end: 10,
            },
            options: [{ option: '' }],
            answer: null,
        });
        setShowError(false);
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="btn btn-square loading"></div>
                </div>
            ) : (
                <div className="h-screen w-screen bg-base-200 overflow-y-auto">
                    <div className="m-8 flex items-center justify-between">
                        <div className="dropdown dropdown-right lg:hidden">
                            <label tabIndex={0} className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                            </label>
                            <div tabIndex={0} className="form-control dropdown-content menu p-2 shadow bg-base-100 rounded-box w-68">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Buscar formulario..."
                                        className="input input-bordered"
                                        value={searchTerm}
                                        onChange={SearchTermChange}
                                    />
                                    <button className="btn btn-square hover:bg-orange-600 hover:text-white" onClick={SearchReset}>
                                        <i className="fa-solid fa-broom fa-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-control hidden lg:block">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Buscar formulario..."
                                    className="input input-bordered"
                                    value={searchTerm}
                                    onChange={SearchTermChange}
                                />
                                <button className="btn btn-square hover:bg-orange-600 hover:text-white" onClick={SearchReset}>
                                    <i className="fa-solid fa-broom fa-lg"></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <h1 className="text-5xl font-bold">Crea y Comparte</h1>
                        </div>
                    </div>
                    <div className="mt-8 ml-8 mr-8">
                        {showError && (
                            <div className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-sm">Completa todos los campos.</span>
                            </div>
                        )}
                        {showCreateConfirmation && (
                            <div className="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div className="items-center">
                                    <span>¿Estás seguro de que deseas crear este formulario?</span>
                                    <button
                                        className="ml-2 btn btn-sm btn-ghost"
                                        onClick={() => setShowCreateConfirmation(false)}>
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-ghost hover:bg-orange-600 hover:text-white"
                                        onClick={createForm}>
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        )}
                        {showShareForm && formToShare && (
                            <div className="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div className="items-center">
                                    <span>¿Estás seguro de que deseas compartir este formulario?
                                        Todos los cambios anteriores se perderan.
                                    </span>
                                    <button
                                        className="ml-2 btn btn-sm btn-ghost"
                                        onClick={() => setShowShareForm(false)}>
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-ghost hover:bg-orange-600 hover:text-white"
                                        onClick={shareForm}>
                                        Compartir
                                    </button>
                                </div>
                            </div>
                        )}
                        {showConfirmation && (
                            <div className="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {formToDelete ? (
                                    <div className="items-center">
                                        <span>¿Estás seguro de que deseas eliminar este formulario?</span>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost"
                                            onClick={() => setShowConfirmation(false)}>
                                            Cancelar
                                        </button>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost hover:bg-red-600 hover:text-white"
                                            onClick={() => {
                                                deleteForm(formToDelete);
                                                setShowConfirmation(false);
                                            }}>
                                            Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <span>¿Estás seguro de que deseas eliminar todos los formularios?</span>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost"
                                            onClick={() => setShowConfirmation(false)}>
                                            Cancelar
                                        </button>
                                        <button className="ml-2 btn btn-sm btn-ghost hover:bg-red-600 hover:text-white" onClick={() => {
                                            deletedAllForms();
                                            setShowConfirmation(false);
                                        }}>Eliminar todos</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-8 flex flex-col md:grid md:grid-cols-8 gap-4">
                        <div className="md:col-span-2">
                            <div className="my-4 flex justify-between items-center">
                                <p className="text-xl font-semibold">Agregar Formulario</p>
                                <div className="flex justify-end">
                                    <label
                                        className="btn btn-ghost mask mask-squircle swap swap-rotate hover:bg-orange-600 hover:text-white">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={handleCheckboxChange} />
                                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>
                                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>
                                    </label>
                                </div>
                            </div>
                            {showForm && (
                                <div className="card card-body bg-base-100 shadow-xl">
                                    <form onSubmit={handleCreateConfirm}>
                                        <div className="mb-2 flex justify-between items-center">
                                            <input
                                                type="text"
                                                placeholder="Nombre del Formulario"
                                                className="input input-bordered w-96"
                                                value={selectedForm.title}
                                                onChange={(e) =>
                                                    setSelectedForm({ ...selectedForm, title: e.target.value })
                                                }
                                            />
                                            <button
                                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end"
                                                type="submit">
                                                <i className="fa-solid fa-floppy-disk fa-2xl"></i>
                                            </button>
                                        </div>
                                        <textarea
                                            className="my-2 textarea textarea-bordered textarea-xs w-full"
                                            placeholder="Descripción del Formulario"
                                            value={selectedForm.description}
                                            onChange={(e) =>
                                                setSelectedForm({ ...selectedForm, description: e.target.value })
                                            }
                                        ></textarea>
                                        <select
                                            id="type"
                                            name="type"
                                            className="my-2 select select-bordered w-full"
                                            value={newQuestion.type}
                                            onChange={handleQuestionChange}>
                                            <option defaultValue="">Tipo de Pregunta</option>
                                            <option value="text">Texto</option>
                                            <option value="scale">Escala</option>
                                            <option value="multiple-choice">Opción Multiple</option>
                                        </select>
                                        <div className="my-2 flex justify-between items-center">
                                            <input
                                                id="question"
                                                name="question"
                                                type="text"
                                                placeholder="Escribe una Pregunta"
                                                className="input input-bordered w-96"
                                                value={newQuestion.question}
                                                onChange={handleQuestionChange} />
                                            <button
                                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end"
                                                type="button"
                                                onClick={addQuestion}>
                                                <i className="fa-solid fa-arrow-right fa-lg"></i>
                                            </button>
                                        </div>
                                        {newQuestion.type === 'scale' && (
                                            <div className="collapse">
                                                <input type="checkbox" />
                                                <div className="collapse-title text-sm">
                                                    Click para ver los parametros.
                                                </div>
                                                <div className="collapse-content">
                                                    <table className="my-2 table table-xs">
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
                                            </div>
                                        )}
                                        {newQuestion.type === 'text' && (
                                            <div>
                                            </div>
                                        )}
                                        {newQuestion.type === 'multiple-choice' && (
                                            <div className="mb-2">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold">Agregar Opción</p>
                                                    <button
                                                        className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end"
                                                        type="button"
                                                        onClick={addOption}
                                                    >
                                                        <i className="fa-solid fa-plus fa-lg"></i>
                                                    </button>
                                                </div>
                                                <div className="mt-4 max-h-40 overflow-y-auto">
                                                    {newQuestion.options.map((option, index) => (
                                                        <div key={index} className="mb-2 flex justify-between items-center">
                                                            <input
                                                                type="text"
                                                                className="input input-bordered w-96"
                                                                placeholder={`Opción ${index + 1}`}
                                                                value={option.option}
                                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            />
                                                            <button
                                                                className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white flex justify-end"
                                                                type="button"
                                                                onClick={() => removeOption(index)}
                                                            >
                                                                <i className="fa-solid fa-trash fa-lg"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                    <div className="m-4 overflow-y-auto max-h-40">
                                        {selectedForm.questions.map((question, index) => (
                                            <div key={index} className="flex items-center justify-between border-b border-orange-600 py-4">
                                                <div>
                                                    <p>{question.question}</p>
                                                    <p className="font-bold">Tipo: {question.type}</p>
                                                </div>
                                                <div className="mr-2 flex justify-end">
                                                    <label
                                                        htmlFor={`updatequestion-${index}`}
                                                        className="btn btn-ghost mask mask-squircle hover:bg-yellow-500 hover:text-white"
                                                        onClick={() => editQuestion(index)}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                                    </label>
                                                    <input type="checkbox" id={`updatequestion-${index}`} className="modal-toggle" />
                                                    <div className="modal">
                                                        <div className="modal-box">
                                                            <div className="modal-action">
                                                                <label
                                                                    htmlFor={`updatequestion-${index}`}
                                                                    className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                                >
                                                                    ✕
                                                                </label>
                                                            </div>
                                                            <div className="mr-8 ml-8 form-control">
                                                                <p className="mb-8 card-title">Actualizar Pregunta</p>
                                                                <input
                                                                    placeholder={question.question}
                                                                    value={editedQuestions[index]?.question || ''}
                                                                    className="mb-4 input input-bordered w-96"
                                                                    onChange={(e) => handleEditedQuestionChange(index, e.target.value)}
                                                                    type="text"
                                                                />
                                                                <select
                                                                    id="type"
                                                                    name="type"
                                                                    className="mb-8 select select-bordered w-96"
                                                                    placeholder={question.type}
                                                                    value={editedQuestions[index]?.type || ''}
                                                                    onChange={(e) => handleEditedQuestionTypeChange(index, e.target.value)}
                                                                >
                                                                    <option value="">Tipo de Pregunta</option>
                                                                    <option value="text">Texto</option>
                                                                    <option value="scale">Escala</option>
                                                                    <option value="multiple-choice">Opción Múltiple</option>
                                                                </select>
                                                                {editedQuestions[index]?.type === 'multiple-choice' && editedQuestions[index]?.options.length > 0 && (
                                                                    <div className="mb-4">
                                                                        <div className="flex justify-between items-center">
                                                                            <p className="font-semibold">Agregar Opción</p>
                                                                            <button
                                                                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end"
                                                                                type="button"
                                                                                onClick={() => addEditedOption(index)}
                                                                            >
                                                                                <i className="fa-solid fa-plus fa-lg"></i>
                                                                            </button>
                                                                        </div>
                                                                        <div className="mb-4 max-h-40 overflow-y-auto">
                                                                            {editedQuestions[index]?.options.map((option, optionIndex) => (
                                                                                <div key={optionIndex} className="m-2 flex justify-between items-center">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="input input-bordered w-96"
                                                                                        placeholder={`Opción ${optionIndex + 1}`}
                                                                                        value={option.option}
                                                                                        onChange={(e) => handleEditedOptionChange(index, optionIndex, e.target.value)}
                                                                                    />
                                                                                    <button
                                                                                        className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white flex justify-end"
                                                                                        type="button"
                                                                                        onClick={() => removeEditedOption(index, optionIndex)}
                                                                                    >
                                                                                        <i className="fa-solid fa-trash fa-lg"></i>
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <button
                                                                    className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
                                                                    onClick={() => updateQuestion(index, editedQuestions[index])}
                                                                >
                                                                    Actualizar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeQuestion(index)}
                                                        className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                    >
                                                        <i className="fa-solid fa-trash fa-lg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between m-2">
                                        <p>Preguntas: {selectedForm.questions.length}</p>
                                        <button
                                            className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white justify-end"
                                            onClick={removeAllQuestions}>
                                            <i className="fa-solid fa-trash fa-lg"></i>
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>

                        <div className="md:col-span-6 md:border-l-4 md:border-l-orange-600">
                            <div className="ml-4 flex flex-wrap justify-center items-center">
                                {filtered.map((form, index) => (
                                    <div key={index} className="m-4 card w-80 h-52 shadow-xl bg-base-100">
                                        <div className="card-body">
                                            <h2 className="card-title">{form.title}</h2>
                                            <p className="overflow-y-scroll h-12">{form.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="dropdown dropdown-end">
                                                    <label
                                                        tabIndex={0}
                                                        className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                                                        onClick={toggleDropdown}>
                                                        <i className="fa-solid fa-eye fa-xl"></i>
                                                    </label>
                                                    {showDropdown && (
                                                        <div tabIndex={0} className="mt-2 dropdown-content z-[1] menu p-2 bg-base-100 rounded-lg w-20 shadow-xl">
                                                            <label
                                                                htmlFor={`desktop${form._id}`}
                                                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                                                                onClick={toggleFormDesktop}>
                                                                <i className="fa-solid fa-desktop fa-lg"></i>
                                                            </label>
                                                            <label
                                                                htmlFor={`mobile${form._id}`}
                                                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                                                                onClick={toggleFormMobile}>
                                                                <i className="fa-solid fa-mobile fa-lg"></i>
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-end">
                                                    <label
                                                        htmlFor={`updateform${form._id}`}
                                                        className="btn btn-ghost mask mask-squircle hover:bg-yellow-500 hover:text-white">
                                                        <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                                    </label>
                                                    <button
                                                        onClick={() => handleDeleteConfirmation(form._id)}
                                                        className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white">
                                                        <i className="fa-solid fa-trash fa-lg"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                                                        onClick={() => handleShareForm(form._id)}>
                                                        <i className="fa-solid fa-share-nodes fa-lg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <input type="checkbox" id={`updateform${form._id}`} className="modal-toggle" />
                                            <div className="modal">
                                                <div className="modal-box">
                                                    <div className="modal-action">
                                                        <label
                                                            htmlFor={`updateform${form._id}`}
                                                            className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white">
                                                            ✕
                                                        </label>
                                                    </div>
                                                    <form
                                                        className="mr-8 ml-8 form-control"
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            updateForm(form._id, selectedForm);
                                                        }}
                                                    >
                                                        <p className="mb-8 card-title">Actualizar Formulario</p>
                                                        <label className="label">
                                                            <span className="label-text">Nombre del Formulario</span>
                                                        </label>
                                                        <input
                                                            placeholder={form.title}
                                                            value={selectedForm.title}
                                                            className="mb-4 input input-bordered w-full"
                                                            onChange={(e) =>
                                                                setSelectedForm({ ...selectedForm, title: e.target.value })
                                                            }
                                                            type="text"
                                                        />
                                                        <label className="label">
                                                            <span className="label-text">Descripción</span>
                                                        </label>
                                                        <input
                                                            placeholder={form.description}
                                                            value={selectedForm.description}
                                                            className="mb-4 input input-bordered w-full"
                                                            onChange={(e) =>
                                                                setSelectedForm({ ...selectedForm, description: e.target.value })
                                                            }
                                                            type="text"
                                                        />
                                                        <div className="m-4 overflow-y-auto max-h-40">
                                                            {form.questions.map((question, index) => (
                                                                <div key={index} className="flex items-center justify-between border-b border-orange-600 py-4">
                                                                    <div>
                                                                        <p>{question.question}</p>
                                                                        <p className="font-bold">Tipo: {question.type}</p>
                                                                    </div>
                                                                    <div className="mr-2 flex justify-end">
                                                                        <label
                                                                            htmlFor={`updatequestionsform-${form._id}-${question._id}`}
                                                                            className="btn btn-ghost mask mask-squircle hover:bg-yellow-500 hover:text-white"
                                                                        >
                                                                            <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                                                        </label>
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`updatequestionsform-${form._id}-${question._id}`}
                                                                            className="modal-toggle"
                                                                        />
                                                                        <div className="modal">
                                                                            <div className="modal-box">
                                                                                <div className="modal-action">
                                                                                    <label
                                                                                        htmlFor={`updatequestionsform-${form._id}-${question._id}`}
                                                                                        className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                                                    >
                                                                                        ✕
                                                                                    </label>
                                                                                </div>
                                                                                <div className="mr-8 ml-8 form-control">
                                                                                    <p className="mb-8 card-title">Actualizar Pregunta</p>
                                                                                    <input
                                                                                        placeholder={question.question}
                                                                                        className="mb-4 input input-bordered w-full"
                                                                                        onChange={(e) => handleEditedQuestionChange(index, e.target.value)}
                                                                                        type="text"
                                                                                    />
                                                                                    <select
                                                                                        id={`type-${form._id}-${question._id}`}
                                                                                        name="type"
                                                                                        className="mb-8 select select-bordered w-full"
                                                                                        onChange={(e) => handleEditedQuestionTypeChange(index, e.target.value)}
                                                                                        value={editedQuestions[index]?.type || ''}
                                                                                    >
                                                                                        <option value="text">Texto</option>
                                                                                        <option value="scale">Escala</option>
                                                                                        <option value="multiple-choice">Opción Múltiple</option>
                                                                                    </select>
                                                                                    {editedQuestions[index]?.type === 'multiple-choice' && editedQuestions[index]?.options.length > 0 && (
                                                                                        <div className="mb-4">
                                                                                            <div className="flex justify-between items-center">
                                                                                                <p className="font-semibold">Agregar Opción</p>
                                                                                                <button
                                                                                                    className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end"
                                                                                                    type="button"
                                                                                                    onClick={() => addEditedOption(index)}
                                                                                                >
                                                                                                    <i className="fa-solid fa-plus fa-lg"></i>
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="mb-4 max-h-40 overflow-y-auto">
                                                                                                {editedQuestions[index]?.options.map((option, optionIndex) => (
                                                                                                    <div key={optionIndex} className="m-2 flex justify-between items-center">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className="input input-bordered w-96"
                                                                                                            placeholder={`Opción ${optionIndex + 1}`}
                                                                                                            value={option.option}
                                                                                                            onChange={(e) => handleEditedOptionChange(index, optionIndex, e.target.value)}
                                                                                                        />
                                                                                                        <button
                                                                                                            className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white flex justify-end"
                                                                                                            type="button"
                                                                                                            onClick={() => removeEditedOption(index, optionIndex)}
                                                                                                        >
                                                                                                            <i className="fa-solid fa-trash fa-lg"></i>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    <button
                                                                                        className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-700 hover:text-white w-full"
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            updateQuestionForm(form._id, question._id, editedQuestions[index]);
                                                                                            document.getElementById(`updatequestionsform-${form._id}-${question._id}`).checked = false;
                                                                                        }}
                                                                                    >
                                                                                        Actualizar
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => deleteQuestionForm(e, form._id, question._id)}
                                                                            className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                                        >
                                                                            <i className="fa-solid fa-trash fa-lg"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mb-8 flex items-center justify-between m-2">
                                                            <p>Preguntas: {form.questions.length}</p>
                                                            <button
                                                                className="btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white justify-end"
                                                                onClick={(e) => deleteAllQuestionsForm(e, form._id)}>
                                                                <i className="fa-solid fa-trash fa-lg"></i>
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-700 w-full"
                                                        >
                                                            Actualizar
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="checkbox" id={`desktop${form._id}`} className="modal-toggle" />
                                        <div className="modal">
                                            <div className="modal-box">
                                                <label
                                                    htmlFor={`desktop${form._id}`}
                                                    className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                    onClick={toggleDropdown}>
                                                    <i className="fa-solid fa-eye-slash fa-lg"></i>
                                                </label>
                                                {showDesktop && (
                                                    <div className="items-center">
                                                        <div className="mt-6 mockup-window border bg-base-300">
                                                            <div className="m-4">
                                                                <h1 className="text-3xl font-bold">{form.title}</h1>
                                                                <p>{form.description}</p>
                                                            </div>
                                                            <div className="overflow-y-auto max-h-96">
                                                                {form.questions.map((question, index) => (
                                                                    <div key={index} className="p-4">
                                                                        <p>{question.question}</p>
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
                                                                        {question.type === 'scale' && question.scale && (
                                                                            <div className="m-2">
                                                                                <input type="range" min={question.scale.min} max={question.scale.max} value={question.scale.step} className="range" step={question.scale.step} />
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
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <input type="checkbox" id={`mobile${form._id}`} className="modal-toggle" />
                                        <div className="modal">
                                            <div className="modal-box">
                                                <label
                                                    htmlFor={`mobile${form._id}`}
                                                    className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                    onClick={toggleDropdown}>
                                                    <i className="fa-solid fa-eye-slash fa-lg"></i>
                                                </label>
                                                {showMobile && (
                                                    <div className="flex items-center">
                                                        <div className="mockup-phone">
                                                            <div className="camera"></div>
                                                            <div className="display">
                                                                <div className="artboard artboard-demo phone-1">
                                                                    <div className="m-4">
                                                                        <h1 className="text-3xl font-bold">{form.title}</h1>
                                                                        <p>{form.description}</p>
                                                                    </div>
                                                                    <div className="overflow-y-auto max-h-96">
                                                                        {form.questions.map((question, index) => (
                                                                            <div key={index} className="m-4 border-b border-orange-600 py-4">
                                                                                <p>{question.question}</p>
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
                                                                                {question.type === 'scale' && question.scale && (
                                                                                    <div className="m-2">
                                                                                        <input type="range" min={question.scale.min} max={question.scale.max} value={question.scale.step} className="range" step={question.scale.step} />
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="m-2 flex items-center justify-end">
                                <p className="text-sm">Formularios: {forms.length}</p>
                                <button
                                    className="ml-2 btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white flex justify-end"
                                    onClick={() => {
                                        setShowConfirmation(true);
                                        setFormToDelete(null);
                                    }}>
                                    <i className="fa-solid fa-trash fa-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Create