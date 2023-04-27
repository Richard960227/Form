import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/teachers';

const Teachers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState({
        name: '',
        lastname1: '',
        lastname2: '',
        subject: ''
    });
    const [totalTeachers, setTotalTeachers] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        getTeachers();
    }, []);

    useEffect(() => {
        async function getTeacherById() {
            try {
                const response = await axios.get(`${URI}/${id}`);
                setSelectedTeacher(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            getTeacherById();
        }
    }, [id]);

    async function getTeachers() {
        try {
            const response = await axios.get(URI);
            if (Array.isArray(response.data)) {
                setTeachers(response.data);
                setFilteredTeachers(response.data);
                const totalTeachers = response.data.length;
                setTotalTeachers(totalTeachers);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    async function createTeacher(event) {
        event.preventDefault();
        try {
            const response = await axios.post(URI, selectedTeacher);
            setTeachers((teachers) => [...teachers, response.data]);
            setSelectedTeacher({
                name: '',
                lastname1: '',
                lastname2: '',
                subject: ''
            });
            document.getElementById('create').checked = false;
            getTeachers();
        } catch (error) {
            console.error(error);
        }
    }

    async function updateTeacher(id, teacher) {
        try {
            const response = await axios.put(`${URI}/${id}`, teacher);
            setTeachers((teachers) =>
                teachers.map((t) => (t._id === id ? response.data : t))
            );
            document.getElementById(`update${id}`).checked = false;
            getTeachers();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteTeacher(id) {
        try {
            await axios.delete(`${URI}/${id}`);
            setTeachers((teachers) => teachers.filter((t) => t._id !== id));
            getTeachers();
        } catch (error) {
            console.error(error);
        }
    }

    async function deletedAllTeachers() {
        try {
            const response = await axios.delete(URI);
            console.log(response.data.message);
            setTeachers([]);
            getTeachers();
        } catch (error) {
            console.error(error);
        }
    }

    async function SearchTermChange(event) {
        try {
            const value = event.target.value;
            // Validar si el valor es una cadena de texto antes de convertirlo a minúsculas
            const searchTerm = typeof value === "string" ? value.toLowerCase() : value;

            setSearchTerm(searchTerm);

            const filteredTeachers = teachers.filter((teacher) =>
                teacher.nombre.toLowerCase().includes(searchTerm)
            );
            setFilteredTeachers(filteredTeachers);
        } catch (error) {
            console.error(error);
        }
    }

    async function SearchReset() {
        try {
            setSearchTerm('');
            setFilteredTeachers(teachers);
        } catch (error) {
            console.error(error);
        }
    }

    async function orderByAsc() {
        try {
            const sortedTeachers = [...teachers].sort((a, b) =>
                a.nombre > b.nombre ? 1 : -1
            );
            const filteredSortedTeachers = sortedTeachers.filter((s) =>
                s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTeachers(filteredSortedTeachers);
        } catch (error) {
            console.error(error);
        }
    }

    async function orderByDesc() {
        try {
            const sortedTeachers = [...teachers].sort((a, b) =>
                a.nombre < b.nombre ? 1 : -1
            );
            const filteredSortedTeachers = sortedTeachers.filter((s) =>
                s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTeachers(filteredSortedTeachers);
        } catch (error) {
            console.error(error);
        }
    }

    async function Download() {
        try {
            const columns = Object.keys(selectedTeacher); // obtener los nombres de las columnas desde el objeto selectedTeadcher
            const csvData = [columns.join(',')].concat(filteredTeachers.map(row => Object.values(row).slice(1, -1).join(','))).join('\n'); // concatenar los nombres de las columnas con los valores de cada fila en el archivo CSV
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            // Obtener el valor del input
            const filename = document.getElementById("filename").value;
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
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
                <div>
                    <div className="flex justify-end">
                        <h1 className="text-5xl font-bold m-2">Docentes</h1>
                    </div>
                    <div className="flex items-center justify-between m-2">
                        <div className="form-control">
                            <div className="input-group m-2">
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
                        <div className="flex justify-end m-2">
                            <div className="dropdown border-orange-600">
                                <label tabIndex="0" className="btn btn-ghost m-2">
                                    <i className="fa-solid fa-filter fa-lg"></i>
                                </label>
                                <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li></li>
                                </ul>
                            </div>
                            <button className="btn btn-ghost m-2" onClick={orderByAsc}>
                                <i className="fa-solid fa-arrow-down-a-z fa-lg"></i>
                            </button>
                            <button className="btn btn-ghost m-2" onClick={orderByDesc}>
                                <i className="fa-solid fa-arrow-down-z-a fa-lg"></i>
                            </button>
                            {/* The button to open modal */}
                            <label htmlFor="download" className="btn btn-ghost m-2">
                                <i className="fa-solid fa-file-arrow-down fa-lg"></i>
                            </label>
                            {/* Put this part before </body> tag */}
                            <input type="checkbox"
                                id="download"
                                className="modal-toggle" />
                            <div className="modal fixed z-50 inset-0 overflow-y-auto">
                                <div className="modal-box relative mx-auto max-w-xs">
                                    <p className="card-title">Descargar Datos</p>
                                    <label htmlFor="download"
                                        className="btn btn-ghost btn-circle hover:border-red-400 active:border-red-600 absolute right-2 top-2">
                                        ✕
                                    </label>
                                    <div className="form-control">
                                        <div className="input-group m-2">
                                            <input
                                                id="filename"
                                                type="text"
                                                placeholder="Nombre del Archivo"
                                                className="input input-bordered"
                                            />
                                            <button className="btn btn-square"
                                                onClick={Download}>
                                                <i className="fa-solid fa-download fa lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* The button to open modal */}
                            <label htmlFor="create" className="btn btn-ghost m-2">
                                <i className="fa-solid fa-plus"></i>
                            </label>
                        </div>
                    </div>
                    {/* Create */}
                    < input type="checkbox" id="create" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="create" className="btn btn-ghost btn-circle hover:border-red-400 hover:bg-white active:border-red-600 active:bg-white absolute right-2 top-2">✕</label>
                            <div className="card-body">
                                <form onSubmit={createTeacher}>
                                    <div className="form-control">
                                        <p className="card-title">Crear Docente</p>
                                        <label className="label">
                                            <span className="label-text">Nombre</span>
                                        </label>
                                        <input
                                            placeholder="Nombre"
                                            value={selectedTeacher.name}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                                            type='text'
                                        />
                                        <label className="label">
                                            <span className="label-text">Apellido Paterno</span>
                                        </label>
                                        <input
                                            placeholder="Apellido Paterno"
                                            value={selectedTeacher.lastname1}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, lastname1: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Apellido Materno</span>
                                        </label>
                                        <input placeholder="Apellido Materno"
                                            value={selectedTeacher.lastname2}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, lastname2: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Cursos</span>
                                        </label>
                                        <input placeholder="Cursos"
                                            value={selectedTeacher.subject}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, subject: e.target.value })}
                                            type='text' />
                                    </div>
                                    <div className="form-control mt-6">
                                        <button type='submit' className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-400">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="m-6">
                        {filteredTeachers.map((teacher, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-orange-600 py-4">
                                <div className="flex items-center">
                                    <div className="mask mask-squircle bg-orange-600 h-10 w-10 flex items-center justify-center text-white">
                                        {teacher.name.charAt(0)}{teacher.lastname1.charAt(0)}
                                    </div>
                                    <div className="ml-2">
                                        <p className="font-bold">{teacher.name}</p>
                                        <p>{teacher.lastname1} {teacher.lastname2}</p>
                                        <p>Cursos: {teacher.subject}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="tooltip tooltip-warning" data-tip="Editar">
                                        <label htmlFor={`update${teacher._id}`} className="btn btn-ghost hover:border-yellow-400 hover:bg-white active:border-yellow-600 active:bg-white"><i className="fa-solid fa-pen-to-square"></i></label>
                                        {/* Update */}
                                        <input type="checkbox" id={`update${teacher._id}`} className="modal-toggle" />
                                        <div className="modal">
                                            <div className="modal-box relative">
                                                <label htmlFor={`update${teacher._id}`} className="btn btn-ghost btn-circle hover:border-red-400 hover:bg-white active:border-red-600 active:bg-white absolute right-2 top-2">✕</label>
                                                <div className="card-body">
                                                    <form onSubmit={(e) => { e.preventDefault(); updateTeacher(teacher._id, selectedTeacher); }}>
                                                        <div className="form-control">
                                                            <p className="card-title">Actualizar Docente</p>
                                                            <label className="label">
                                                                <span className="label-text">Nombre</span>
                                                            </label>
                                                            <input
                                                                placeholder={teacher.name}
                                                                value={selectedTeacher.name}
                                                                className="input input-bordered"
                                                                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}

                                                                type='text' />
                                                            <label className="label">
                                                                <span className="label-text">Apellido Paterno</span>
                                                            </label>
                                                            <input
                                                                placeholder={teacher.lastname1}
                                                                value={selectedTeacher.lastname1}
                                                                className="input input-bordered"
                                                                onChange={(e) => setSelectedTeacher((prevState) => ({ ...prevState, lastname1: e.target.value }))}
                                                                type='text' />
                                                            <label className="label">
                                                                <span className="label-text">Apellido Materno</span>
                                                            </label>
                                                            <input
                                                                placeholder={teacher.lastname2}
                                                                value={selectedTeacher.lastname2}
                                                                className="input input-bordered"
                                                                onChange={(e) => setSelectedTeacher((prevState) => ({ ...prevState, lastname2: e.target.value }))}
                                                                type='text' />
                                                            <label className="label">
                                                                <span className="label-text">Cursos</span>
                                                            </label>
                                                            <input
                                                                placeholder={teacher.subject}
                                                                value={selectedTeacher.subject}
                                                                className="input input-bordered"
                                                                onChange={(e) => setSelectedTeacher((prevState) => ({ ...prevState, subject: e.target.value }))}
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
                                    <div className="tooltip tooltip-error" data-tip="Eliminar">
                                        <button onClick={() => deleteTeacher(teacher._id)} className="btn btn-ghost hover:border-red-400 hover:bg-white active:border-red-600 active:bg-white"><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-end m-2">
                        <button
                            className="btn btn-ghost m-2">
                            <i className="fa-solid fa-arrows-rotate fa-lg"></i>
                        </button>
                        <p className="m-2">Registros: <span id="total-teachers">{totalTeachers}</span></p>
                        <button
                            className="btn btn-ghost hover:border-red-400 active:border-red-600"
                            onClick={deletedAllTeachers}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div >
            )}
        </>
    )
};

export default Teachers;