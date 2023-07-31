import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/students';

const Students = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { id } = useParams();

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        async function getStudentById() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URI}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStudents(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            getStudentById();
        }
    }, [id]);

    async function getStudents() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(URI, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (Array.isArray(response.data)) {
                setStudents(response.data);
                setFilteredStudents(response.data);
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

            const filteredStudents = students.filter((student) =>
                student.ALUMNO.toLowerCase().includes(searchTerm) ||
                student.CAMPUS.toLowerCase().includes(searchTerm) ||
                student.NIVEL.toLowerCase().includes(searchTerm) ||
                student.CRN.toString().toLowerCase().includes(searchTerm) ||
                student.CLAVE_MATERIA.toLowerCase().includes(searchTerm) ||
                student.MATERIA.toLowerCase().includes(searchTerm) ||
                student.SOCIO_INTEG.toLowerCase().includes(searchTerm) ||
                student.PERIODO.toString().includes(searchTerm) ||
                student.BLOQUE.toString().toLowerCase().includes(searchTerm) ||
                student.MATRICULA.toString().toLowerCase().includes(searchTerm) ||
                student.ESTATUS.toLowerCase().includes(searchTerm) ||
                student.TIPO_ALUMNO.toLowerCase().includes(searchTerm) ||
                student.CLAVE_PROGRAMA.toString().toLowerCase().includes(searchTerm) ||
                student.PROGRAMA.toLowerCase().includes(searchTerm) ||
                student.DOCENTE.toLowerCase().includes(searchTerm) ||
                student.CORREO_PREF.toLowerCase().includes(searchTerm)
            );
            setFilteredStudents(filteredStudents);
        } catch (error) {
            console.error(error);
        }
    }

    async function SearchReset() {
        try {
            setSearchTerm('');
            setFilteredStudents(students);
        } catch (error) {
            console.error(error);
        }
    }

    async function orderByAsc() {
        try {
            const sortedStudents = [...students].sort((a, b) =>
                a.ALUMNO > b.ALUMNO ? 1 : -1
            );
            const filteredSortedStudents = sortedStudents.filter((s) =>
                s.ALUMNO.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filteredSortedStudents);
        } catch (error) {
            console.error(error);
        }
    }

    async function orderByDesc() {
        try {
            const sortedStudents = [...students].sort((a, b) =>
                a.ALUMNO < b.ALUMNO ? 1 : -1
            );
            const filteredSortedStudents = sortedStudents.filter((s) =>
                s.ALUMNO.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filteredSortedStudents);
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
                            <h1 className="text-5xl font-bold">Estudiantes</h1>
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
                        {filteredStudents.map((student, index) => (
                            <div key={index} className="m-4 flex items-center justify-between border-b border-orange-600 py-4">
                                <div className="flex items-center">
                                    <div className="m-4 mask mask-squircle bg-orange-600 h-10 w-10 flex items-center justify-center text-white">
                                        {student.CAMPUS.substring(0, 3)}
                                    </div>
                                    <div className="ml-2">
                                        <p className="font-semibold">{student.CAMPUS}</p>
                                        <p>{student.NIVEL}</p>
                                        <p>{student.CLAVE_PROGRAMA}: {student.PROGRAMA}</p>
                                    </div>
                                </div>
                                <div className="w-1/4 flex-shrink-0">
                                    <p>Parte Periodo: {student.PARTE_PERIODO}</p>
                                    <p>Periodo: {student.PERIODO}</p>
                                    <p>CRN: {student.CRN}</p>
                                </div>
                                <div className="w-1/4 flex-shrink-0">
                                    <p>Socio Integrado: {student.SOCIO_INTEG}</p>
                                    <p>Estatus: {student.ESTATUS}</p>
                                    <p>Tipo Alumno: {student.TIPO_ALUMNO}</p>

                                </div>
                                <div className="mr-2 w-1/4 flex-shrink-0 text-right">
                                    <p>{student.BLOQUE}  |   {student.MATRICULA}</p>
                                    <p>{student.ALUMNO}</p>
                                    <p>{student.CORREO_PREF}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="m-10 flex justify-end">
                        <p className="text-sm">Registros: {students.length}</p>
                    </div>
                </div >
            )}
        </>
    )
};

export default Students;

