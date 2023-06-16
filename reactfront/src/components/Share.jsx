import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/form'

const Share = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [forms, setForms] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForm, setSelectedForm] = useState({
        title: '',
        description: '',
        questions: [],
    });
    const [showDesktop, setShowDesktop] = useState(false);
    const [showMobile, setShowMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
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
                setFiltered(response.data);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function updateForm(id, form) {
        try {
            const response = await axios.put(`${URI}/${id}`, form);
            setForms((forms) =>
                forms.map((form) => (form._id === id ? response.data : form))
            );
            document.getElementById(`updateform${id}`).checked = false;
            getForms();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteForm(id) {
        try {
            await axios.delete(`${URI}/${id}`);
            setForms((forms) => forms.filter((form) => form._id !== id));
            getForms();
        } catch (error) {
            console.log(error);
        }
    }

    async function deletedAllForms() {
        try {
            const response = await axios.delete(URI);
            console.log(response.data.message);
            setForms([]);
            getForms();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleShareForm(formId) {
        try {

            const responsedelete = await axios.delete(`${URI}/select/${formId}`);
            // Realizar la solicitud HTTP al backend para guardar el formulario
            const responsepost = await axios.post(`${URI}/select/${formId}`);

            // Verificar si la solicitud fue exitosa
            if (responsedelete.status === 200 && responsepost.status === 200) {
                console.log('Formulario almacenado exitosamente');
                // Aquí puedes realizar cualquier acción adicional que necesites después de guardar el formulario
            } else {
                console.log('Error al almacenar el formulario');
                // Aquí puedes manejar el caso de error según tus necesidades
            }
        } catch (error) {
            console.error('Error al enviar el formulario al servidor:', error);
            // Aquí puedes manejar el caso de error según tus necesidades
        }
    };

    async function sendFormToStudents(id) {
        try {
            // Realizar la solicitud HTTP al backend para enviar el formulario a los estudiantes
            const response = await axios.post(`${URI}/${id}/send`);

            // Verificar si la solicitud fue exitosa
            if (response.status === 200) {
                console.log('Formulario enviado exitosamente a los estudiantes');
                // Aquí puedes realizar cualquier acción adicional que necesites después de enviar el formulario
            } else {
                console.log('Error al enviar el formulario');
                // Aquí puedes manejar el caso de error según tus necesidades
            }
        } catch (error) {
            console.error('Error al enviar el formulario', error);
            // Aquí puedes manejar el caso de error según tus necesidades
        }
    };

    async function SearchTermChange(event) {
        try {
            const value = event.target.value;
            // Validar si el valor es una cadena de texto antes de convertirlo a minúsculas
            const searchTerm = typeof value === "string" ? value.toLowerCase() : value;

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

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="btn btn-square loading"></div>
                </div>
            ) : (
                <div className="h-screen bg-base-200 overflow-y-scroll">
                    <div className="m-8 flex items-center justify-between">
                        <div className="dropdown dropdown-right lg:hidden">
                            <label tabIndex={0} className="btn btn-ghost mask mask-squircle">
                                <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                            </label>
                            <div tabIndex={0} className="form-control dropdown-content menu p-2 shadow bg-base-100 rounded-box w-68">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="input input-bordered"
                                        value={searchTerm}
                                        onChange={SearchTermChange}
                                    />
                                    <button className="btn btn-square" onClick={SearchReset}>
                                        <i className="fa-solid fa-broom fa-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-control hidden lg:block">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="input input-bordered"
                                    value={searchTerm}
                                    onChange={SearchTermChange}
                                />
                                <button className="btn btn-square" onClick={SearchReset}>
                                    <i className="fa-solid fa-broom fa-lg"></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <h1 className="text-5xl font-bold">Compartir</h1>
                        </div>
                    </div>
                    <div className="m-8 flex flex-wrap justify-center items-center">
                        {filtered.map((form, index) => (
                            <div key={index} className="m-4 card w-96 shadow-xl bg-orange-400 text-white py-4">
                                <div className="card-body">
                                    <h2 className="card-title">{form.title}</h2>
                                    <p className="overflow-y-scroll h-12">{form.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="dropdown dropdown-end">
                                            <label
                                                tabIndex={0}
                                                className="btn btn-ghost mask mask-squircle"
                                                onClick={toggleDropdown}>
                                                <i className="fa-solid fa-eye fa-xl"></i>
                                            </label>
                                            {showDropdown && (
                                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-20 border border-orange-600">
                                                    <li>
                                                        <label htmlFor={`desktop${form._id}`} className="btn btn-ghost mask mask-squircle" onClick={toggleFormDesktop}>
                                                            <i className="fa-solid fa-desktop fa-lg"></i>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label htmlFor={`mobile${form._id}`} className="btn btn-ghost mask mask-squircle" onClick={toggleFormMobile}>
                                                            <i className="fa-solid fa-mobile fa-lg"></i>
                                                        </label>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                        <div className="flex justify-end">
                                            <label
                                                htmlFor={`updateform${form._id}`}
                                                className="btn btn-ghost mask mask-squircle">
                                                <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                            </label>
                                            <button
                                                onClick={() => deleteForm(form._id)}
                                                className="btn btn-ghost mask mask-squircle">
                                                <i className="fa-solid fa-trash fa-lg"></i>
                                            </button>
                                            <button
                                                className="btn btn-ghost mask mask-squircle"
                                                onClick={() => handleShareForm(form._id)}>
                                                <i className="fa-solid fa-share-nodes fa-lg"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Update */}
                                    <input type="checkbox" id={`updateform${form._id}`} className="modal-toggle" />
                                    <div className="modal">
                                        <div className="modal-box relative">
                                            <label
                                                htmlFor={`updateform${form._id}`}
                                                className="btn btn-ghost mask mask-squircle absolute right-2 top-2">
                                                ✕
                                            </label>
                                            <div className="card-body">
                                                <form onSubmit={(e) => { e.preventDefault(); updateForm(form._id, selectedForm); }}>
                                                    <div className="form-control">
                                                        <p className="card-title">Actualizar Formulario</p>
                                                        <label className="label">
                                                            <span className="label-text">Nombre del Formulario</span>
                                                        </label>
                                                        <input
                                                            placeholder={form.title}
                                                            value={selectedForm.title}
                                                            className="input input-bordered"
                                                            onChange={(e) => setSelectedForm({ ...selectedForm, title: e.target.value })}
                                                            type='text' />
                                                        <label className="label">
                                                            <span className="label-text">Descripción</span>
                                                        </label>
                                                        <input
                                                            placeholder={form.description}
                                                            value={selectedForm.description}
                                                            className="input input-bordered"
                                                            onChange={(e) => setSelectedForm({ ...selectedForm, description: e.target.value })}
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
                                <input type="checkbox" id={`desktop${form._id}`} className="modal-toggle" />
                                <div className="modal modal-bottom sm:modal-middle">
                                    <div className="modal-box">
                                        {showDesktop && (
                                            <div className="items-center">
                                                <div className="mockup-window border bg-base-300">
                                                    <div className="m-4">
                                                        <h1 className="text-3xl font-bold">{form.title}</h1>
                                                        <p>{form.description}</p>
                                                    </div>
                                                    <div className="overflow-y-scroll max-h-96">
                                                        {form.questions.map((question, index) => (
                                                            <div key={index} className="m-4 border-b bg-orange-600 py-4">
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
                                                                {question.type === 'scale' && (
                                                                    <div className="m-2">
                                                                        <input type="range" min={question.min} max={question.max} value={question.step} className="range" step={question.step} />
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
                                        <div className="modal-action">
                                            <label htmlFor={`desktop${form._id}`} className="btn btn-ghost mask mask-squircle" onClick={toggleDropdown}>
                                                <i className="fa-solid fa-eye-slash fa-lg"></i>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <input type="checkbox" id={`mobile${form._id}`} className="modal-toggle" />
                                <div className="modal modal-bottom sm:modal-middle">
                                    <div className="modal-box">
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
                                                            <div className="overflow-y-scroll max-h-96">
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
                                                                        {question.type === 'scale' && (
                                                                            <div className="m-2">
                                                                                <input type="range" min={question.min} max={question.max} value={question.step} className="range" step={question.step} />
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
                                        <div className="modal-action">
                                            <label htmlFor={`mobile${form._id}`} className="btn btn-ghost mask mask-squircle" onClick={toggleDropdown}>
                                                <i className="fa-solid fa-eye-slash"></i>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="m-2 flex items-center justify-end">
                        <p className="text-sm">Formularios: {forms.length}</p>
                        <button
                            className="ml-2 btn btn-ghost mask mask-squircle"
                            onClick={deletedAllForms}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Share
