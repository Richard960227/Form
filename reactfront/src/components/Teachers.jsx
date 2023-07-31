import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/teachers';

const Teachers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { id } = useParams();

    useEffect(() => {
        getTeachers();
    }, []);

    useEffect(() => {
        async function getTeacherById() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URI}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTeachers(response.data);
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
            const token = localStorage.getItem('token');
            const response = await axios.get(URI, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (Array.isArray(response.data)) {
                setTeachers(response.data);
                setFilteredTeachers(response.data);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    async function SearchTermChange(event) {
        try {
            const value = event.target.value;
            // Validar si el valor es una cadena de texto antes de convertirlo a minúsculas
            const searchTerm = typeof value === "string" ? value.toLowerCase() : value;

            setSearchTerm(searchTerm);

            const filteredTeachers = teachers.filter((teacher) =>
                teacher.DOCENTE.toLowerCase().includes(searchTerm) ||
                teacher.CAMPUS.toLowerCase().includes(searchTerm)
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
                a.DOCENTE > b.DOCENTE ? 1 : -1
            );
            const filteredSortedTeachers = sortedTeachers.filter((s) =>
                s.DOCENTE.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTeachers(filteredSortedTeachers);
        } catch (error) {
            console.error(error);
        }
    }

    async function orderByDesc() {
        try {
            const sortedTeachers = [...teachers].sort((a, b) =>
                a.DOCENTE < b.DOCENTE ? 1 : -1
            );
            const filteredSortedTeachers = sortedTeachers.filter((s) =>
                s.DOCENTE.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTeachers(filteredSortedTeachers);
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
                                        placeholder="Search..."
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
                                    placeholder="Search..."
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
                            <h1 className="text-5xl font-bold">Docentes</h1>
                        </div>
                    </div>
                    <div className="mr-8 flex justify-end">
                        <button className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white" onClick={orderByAsc}>
                            <i className="fa-solid fa-arrow-down-a-z fa-lg"></i>
                        </button>
                        <button className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white" onClick={orderByDesc}>
                            <i className="fa-solid fa-arrow-down-z-a fa-lg"></i>
                        </button>
                    </div>
                    <div className="m-8 overflow-y-auto overflow-x-auto max-h-96 rounded-lg shadow-xl bg-base-100">
                        {filteredTeachers.map((teacher, index) => (
                            <div key={index} className="m-4 flex items-center justify-between border-b border-orange-600 p-4">
                                <div className="flex items-center">
                                    <div className="m-4 mask mask-squircle bg-orange-600 h-10 w-10 flex items-center justify-center text-white">
                                        {teacher.DOCENTE.charAt(0)}
                                    </div>
                                    <div className="ml-2">
                                        <p className="font-bold">{teacher.CAMPUS}</p>
                                        <p className="font-semibold">{teacher.DOCENTE}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {teacher.CLAVES_MATERIAS.map((clave, index) => (
                                        <div key={index}>
                                            <p className="font-semibold">{clave}:
                                                {teacher.MATERIAS[clave].map((materia, materiaIndex) => (
                                                    <span key={materiaIndex} className="ml-2 font-normal">
                                                        {materia}
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="m-10 flex justify-end">
                        <p className="text-sm">Registros: {teachers.length}</p>
                    </div>
                </div >
            )}
        </>
    )
};

export default Teachers;

