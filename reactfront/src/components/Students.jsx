import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/students';

const Students = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState({
        CAMPUS: '',
        NIVEL: '',
        PARTE_PERIODO: '',
        CRN: '',
        CLAVE_MATERIA: '',
        MATERIA: '',
        SOCIO_INTEG: '',
        PERIODO: '',
        BLOQUE: '',
        MATRICULA: '',
        ALUMNO: '',
        ESTATUS: '',
        TIPO_ALUMNO: '',
        CLAVE_PROGRAMA: '',
        PROGRAMA: '',
        DOCENTE: '',
        CORREO_PREF: ''
    });
    const [totalStudents, setTotalStudents] = useState(0);
    const { id } = useParams();

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        async function getStudentById() {
            try {
                const response = await axios.get(`${URI}/${id}`);
                setSelectedStudent(response.data);
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
            const response = await axios.get(URI);
            if (Array.isArray(response.data)) {
                setStudents(response.data);
                setFilteredStudents(response.data);
                const totalStudents = response.data.length;
                setTotalStudents(totalStudents);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    async function createStudent(event) {
        event.preventDefault();
        try {
            const response = await axios.post(URI, selectedStudent);
            setStudents((students) => [...students, response.data]);
            setSelectedStudent({
                CAMPUS: '',
                NIVEL: '',
                PARTE_PERIODO: '',
                CRN: '',
                CLAVE_MATERIA: '',
                MATERIA: '',
                SOCIO_INTEG: '',
                PERIODO: '',
                BLOQUE: '',
                MATRICULA: '',
                ALUMNO: '',
                ESTATUS: '',
                TIPO_ALUMNO: '',
                CLAVE_PROGRAMA: '',
                PROGRAMA: '',
                DOCENTE: '',
                CORREO_PREF: ''
            });
            document.getElementById('create').checked = false;
            getStudents();
        } catch (error) {
            console.error(error);
        }
    }

    async function updateStudent(id, student) {
        try {
            const response = await axios.put(`${URI}/${id}`, student);
            setStudents((students) =>
                students.map((s) => (s._id === id ? response.data : s))
            );
            document.getElementById(`update${id}`).checked = false;
            getStudents();
        } catch (error) {
            console.error(error);
        }
    }

    async function deletedStudent(id) {
        try {
            await axios.delete(`${URI}/${id}`);
            setStudents((students) => students.filter((s) => s._id !== id));
            getStudents();
        } catch (error) {
            console.error(error);
        }
    }

    async function deletedAllStudents() {
        try {
            const response = await axios.delete(URI);
            console.log(response.data.message);
            setStudents([]);
            getStudents();
        } catch (error) {
            console.error(error);
        }
    }

    async function uploadFile(event) {
        event.preventDefault();
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(`${URI}/upload`, formData);
            if (Array.isArray(response.data)) {
                setStudents(response.data);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
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

    async function Download() {
        try {
            const columns = Object.keys(selectedStudent); // obtener los nombres de las columnas desde el objeto selectedStudent
            const csvData = [columns.join(',')].concat(filteredStudents.map(row => Object.values(row).slice(1, -1).join(','))).join('\n'); // concatenar los nombres de las columnas con los valores de cada fila en el archivo CSV
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
                        <h1 className="text-5xl font-bold m-2">Estudiantes</h1>
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
                                    <li>CAMPUS</li>
                                    <li>NIVEL</li>
                                    <li>PARTE_PERIODO</li>
                                    <li>CRN</li>
                                    <li>CLAVE_MATERIA</li>
                                    <li>MATERIA</li>
                                    <li>SOCIO_INTEG</li>
                                    <li>PERIODO</li>
                                    <li>BLOQUE</li>
                                    <li>MATRICULA</li>
                                    <li>ALUMNO</li>
                                    <li>ESTATUS</li>
                                    <li>TIPO_ALUMNO</li>
                                    <li>CLAVE_PROGRAMA</li>
                                    <li>PROGRAMA</li>
                                    <li>DOCENTE</li>
                                    <li>CORREO_PREF</li>
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
                                <i className="fa-solid fa-plus fa-lg"></i>
                            </label>
                        </div>
                    </div>
                    {/* Create */}
                    <input type="checkbox" id="create" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label
                                htmlFor="create"
                                className="btn btn-ghost btn-circle hover:border-red-400 hover:bg-white active:border-red-600 active:bg-white absolute right-2 top-2">
                                ✕
                            </label>
                            <div className="card-body">
                                <p className="card-title">Subir Archivo</p>
                                <form>
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full max-w-xs"
                                        onChange={uploadFile} />

                                    <button
                                        className="ml-4">
                                        <i className="fa-solid fa-file-arrow-up fa-xl"></i>
                                    </button>
                                </form>
                                <div className="divider">Ó</div>
                                <p className="card-title">Crear Estudiante</p>
                                <form onSubmit={createStudent}>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Campus</span>
                                        </label>
                                        <input placeholder="Campus"
                                            value={selectedStudent.CAMPUS}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CAMPUS: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Nivel</span>
                                        </label>
                                        <input placeholder="Nivel"
                                            value={selectedStudent.NIVEL}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, NIVEL: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Parte Periodo</span>
                                        </label>
                                        <input placeholder="Parte Periodo"
                                            value={selectedStudent.PARTE_PERIODO}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, PARTE_PERIODO: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">CRN</span>
                                        </label>
                                        <input placeholder="CRN"
                                            value={selectedStudent.CRN}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CRN: e.target.value })}
                                            type='number' />
                                        <label className="label">
                                            <span className="label-text">Clave Materia</span>
                                        </label>
                                        <input placeholder="Clave Materia"
                                            value={selectedStudent.CLAVE_MATERIA}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_MATERIA: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Materia</span>
                                        </label>
                                        <input placeholder="Materia"
                                            value={selectedStudent.MATERIA}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, MATERIA: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Socio Integ</span>
                                        </label>
                                        <input placeholder="Socio Integ"
                                            value={selectedStudent.SOCIO_INTEG}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, SOCIO_INTEG: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Periodo</span>
                                        </label>
                                        <input placeholder="Periodo"
                                            value={selectedStudent.PERIODO}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, PERIODO: e.target.value })}
                                            type='number' />
                                        <label className="label">
                                            <span className="label-text">Bloque</span>
                                        </label>
                                        <input placeholder="Bloque"
                                            value={selectedStudent.BLOQUE}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, BLOQUE: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Matriculo</span>
                                        </label>
                                        <input placeholder="Matricula"
                                            value={selectedStudent.MATRICULA}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, MATRICULA: e.target.value })}
                                            type='number' />
                                        <label className="label">
                                            <span className="label-text">Alumno</span>
                                        </label>
                                        <input placeholder="Alumno"
                                            value={selectedStudent.ALUMNO}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, ALUMNO: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Estatus</span>
                                        </label>
                                        <input placeholder="Estatus"
                                            value={selectedStudent.ESTATUS}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, ESTATUS: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Tipo Alumno</span>
                                        </label>
                                        <input placeholder="Tipo Alumno"
                                            value={selectedStudent.TIPO_ALUMNO}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, TIPO_ALUMNO: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Clave Programa</span>
                                        </label>
                                        <input placeholder="Clave Programa"
                                            value={selectedStudent.CLAVE_PROGRAMA}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_PROGRAMA: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Programa</span>
                                        </label>
                                        <input placeholder="Programa"
                                            value={selectedStudent.PROGRAMA}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, PROGRAMA: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Docente</span>
                                        </label>
                                        <input placeholder="Docente"
                                            value={selectedStudent.DOCENTE}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, DOCENTE: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Correo Pref</span>
                                        </label>
                                        <input placeholder="Correo Pref"
                                            value={selectedStudent.CORREO_PREF}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CORREO_PREF: e.target.value })}
                                            type='text' />
                                    </div>
                                    <div className="form-control mt-6">
                                        <button
                                            type='submit'
                                            className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-400">
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="m-6 h-96 overflow-x-auto">
                        <table className="table-compact w-full">
                            <thead>
                                <tr className="text-center text-white">
                                    <th className="bg-orange-400">CAMPUS</th>
                                    <th className="bg-orange-400">NIVEL</th>
                                    <th className="bg-orange-400">PARTE_PERIODO</th>
                                    <th className="bg-orange-400">CRN</th>
                                    <th className="bg-orange-400">CLAVE_MATERIA</th>
                                    <th className="bg-orange-400">MATERIA</th>
                                    <th className="bg-orange-400">SOCIO_INTEG</th>
                                    <th className="bg-orange-400">PERIODO</th>
                                    <th className="bg-orange-400">BLOQUE</th>
                                    <th className="bg-orange-400">MATRICULA</th>
                                    <th className="bg-orange-400">ALUMNO</th>
                                    <th className="bg-orange-400">ESTATUS</th>
                                    <th className="bg-orange-400">TIPO_ALUMNO</th>
                                    <th className="bg-orange-400">CLAVE_PROGRAMA</th>
                                    <th className="bg-orange-400">PROGRAMA</th>
                                    <th className="bg-orange-400">DOCENTE</th>
                                    <th className="bg-orange-400">CORREO_PREF</th>
                                    <th className="bg-orange-400"></th>
                                    <th className="bg-orange-400"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (

                                    <tr key={index} className="border-b border-orange-600 py-4">
                                        <td>{student.CAMPUS}</td>
                                        <td>{student.NIVEL}</td>
                                        <td>{student.PARTE_PERIODO}</td>
                                        <td>{student.CRN}</td>
                                        <td>{student.CLAVE_MATERIA}</td>
                                        <td>{student.MATERIA}</td>
                                        <td>{student.SOCIO_INTEG}</td>
                                        <td>{student.PERIODO}</td>
                                        <td>{student.BLOQUE}</td>
                                        <td>{student.MATRICULA}</td>
                                        <td>{student.ALUMNO}</td>
                                        <td>{student.ESTATUS}</td>
                                        <td>{student.TIPO_ALUMNO}</td>
                                        <td>{student.CLAVE_PROGRAMA}</td>
                                        <td>{student.PROGRAMA}</td>
                                        <td>{student.DOCENTE}</td>
                                        <td>{student.CORREO_PREF}</td>
                                        <td>
                                            <label
                                                htmlFor={`update${student._id}`}
                                                className="btn btn-ghost hover:border-yellow-400 active:border-yellow-600">
                                                <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                            </label>
                                            {/* Update */}
                                            <input type="checkbox" id={`update${student._id}`} className="modal-toggle" />
                                            <div className="modal">
                                                <div className="modal-box relative">
                                                    <label htmlFor={`update${student._id}`} className="btn btn-ghost btn-circle hover:border-red-400 active:border-red-600 absolute right-2 top-2">✕</label>
                                                    <div className="card-body">
                                                        <form onSubmit={(e) => { e.preventDefault(); updateStudent(student._id, selectedStudent); }}>
                                                            <div className="form-control">
                                                                <p className="card-title">Actualizar Estudiante</p>
                                                                <label className="label">
                                                                    <span className="label-text">Campus</span>
                                                                </label>
                                                                <input placeholder={student.CAMPUS}
                                                                    value={selectedStudent.CAMPUS}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CAMPUS: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Nivel</span>
                                                                </label>
                                                                <input placeholder={student.NIVEL}
                                                                    value={selectedStudent.NIVEL}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, NIVEL: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Parte Periodo</span>
                                                                </label>
                                                                <input placeholder={student.PARTE_PERIODO}
                                                                    value={selectedStudent.PARTE_PERIODO}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, PARTE_PERIODO: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">CRN</span>
                                                                </label>
                                                                <input placeholder={student.CRN}
                                                                    value={selectedStudent.CRN}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CRN: e.target.value })}
                                                                    type='number' />
                                                                <label className="label">
                                                                    <span className="label-text">Clave Materia</span>
                                                                </label>
                                                                <input placeholder={student.CLAVE_MATERIA}
                                                                    value={selectedStudent.CLAVE_MATERIA}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_MATERIA: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Materia</span>
                                                                </label>
                                                                <input placeholder={student.MATERIA}
                                                                    value={selectedStudent.MATERIA}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, MATERIA: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Socio Integ</span>
                                                                </label>
                                                                <input placeholder={student.SOCIO_INTEG}
                                                                    value={selectedStudent.SOCIO_INTEG}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, SOCIO_INTEG: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Periodo</span>
                                                                </label>
                                                                <input placeholder={student.PERIODO}
                                                                    value={selectedStudent.PERIODO}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, PERIODO: e.target.value })}
                                                                    type='number' />
                                                                <label className="label">
                                                                    <span className="label-text">Bloque</span>
                                                                </label>
                                                                <input placeholder={student.BLOQUE}
                                                                    value={selectedStudent.BLOQUE}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, BLOQUE: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Matriculo</span>
                                                                </label>
                                                                <input placeholder={student.MATRICULA}
                                                                    value={selectedStudent.MATRICULA}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, MATRICULA: e.target.value })}
                                                                    type='number' />
                                                                <label className="label">
                                                                    <span className="label-text">Alumno</span>
                                                                </label>
                                                                <input placeholder={student.ALUMNO}
                                                                    value={selectedStudent.ALUMNO}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, ALUMNO: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Estatus</span>
                                                                </label>
                                                                <input placeholder={student.ESTATUS}
                                                                    value={selectedStudent.ESTATUS}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, ESTATUS: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Tipo Alumno</span>
                                                                </label>
                                                                <input placeholder={student.TIPO_ALUMNO}
                                                                    value={selectedStudent.TIPO_ALUMNO}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, TIPO_ALUMNO: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Clave Programa</span>
                                                                </label>
                                                                <input placeholder={student.CLAVE_PROGRAMA}
                                                                    value={selectedStudent.CLAVE_PROGRAMA}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_PROGRAMA: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Programa</span>
                                                                </label>
                                                                <input placeholder={student.PROGRAMA}
                                                                    value={selectedStudent.PROGRAMA}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, PROGRAMA: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Docente</span>
                                                                </label>
                                                                <input placeholder={student.DOCENTE}
                                                                    value={selectedStudent.DOCENTE}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, DOCENTE: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Correo Pref</span>
                                                                </label>
                                                                <input placeholder={student.CORREO_PREF}
                                                                    value={selectedStudent.CORREO_PREF}
                                                                    className="input input-bordered"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CORREO_PREF: e.target.value })}
                                                                    type='text' />
                                                            </div>
                                                            <div className="form-control mt-6">
                                                                <button
                                                                    type='submit'
                                                                    className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-400">Actualizar</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div></div>
                                            <button
                                                onClick={() => deletedStudent(student._id)}
                                                className="btn btn-ghost hover:border-red-400 active:border-red-600">
                                                <i className="fa-solid fa-trash fa-lg"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-end m-2">
                        <button
                            className="btn btn-ghost m-2">
                            <i className="fa-solid fa-arrows-rotate fa-lg"></i>
                        </button>
                        <p className="m-2">Registros: <span id="total-students">{totalStudents}</span></p>
                        <button
                            className="btn btn-ghost hover:border-red-400 active:border-red-600"
                            onClick={deletedAllStudents}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div >
            )}
        </>
    )
};

export default Students;

