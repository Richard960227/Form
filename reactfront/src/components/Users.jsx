import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URIUSER = 'http://localhost:8000/home/users';
const URI = 'http://localhost:8000/home/students';

const Users = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTermUser, setSearchTermUser] = useState('');
    const [selectedUser, setSelectedUser] = useState({
        user: '',
        password: '',
        role: ''
    });
    const { id } = useParams();

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        async function getUserById() {
            try {
                const response = await axios.get(`${URIUSER}/${id}`);
                setSelectedUser(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        if (id) {
            getUserById();
        }
    }, [id]);

    async function getUsers() {
        try {
            const response = await axios.get(URIUSER);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
                setFilteredUsers(response.data);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function createUser(e) {
        e.preventDefault();
        try {
            const response = await axios.post(URIUSER, selectedUser);
            setUsers((users) => [...users, response.data]);
            setSelectedUser({ user: '', password: '', role: '' });
            document.getElementById('createuser').checked = false;
            getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    async function updateUser(id, user) {
        try {
            const response = await axios.put(`${URIUSER}/${id}`, user);
            setUsers((users) =>
                users.map((user) => (user._id === id ? response.data : user))
            );
            document.getElementById(`updateuser${id}`).checked = false;
            getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteUser(id) {
        try {
            await axios.delete(`${URIUSER}/${id}`);
            setUsers((users) => users.filter((user) => user._id !== id));
            getUsers();
        } catch (error) {
            console.log(error);
        }
    }

    async function deletedAllUsers() {
        try {
            const response = await axios.delete(URIUSER);
            console.log(response.data.message);
            setUsers([]);
            getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    async function SearchTermChangeUser(event) {
        try {

            const value = event.target.value;

            const searchTermUser = typeof value === "string" ? value.toLowerCase() : value;

            setSearchTermUser(searchTermUser);

            const filteredUsers = users.filter((user) =>
                user.user.toLowerCase().includes(searchTermUser) ||
                user.password.toLowerCase().includes(searchTermUser) ||
                user.role.toLowerCase().includes(searchTermUser)
            );
            setFilteredUsers(filteredUsers);
            setFilteredStudents(filteredStudents);
        } catch (error) {
            console.error(error);
        }
    }

    async function SearchResetUser() {
        try {
            setSearchTermUser('');
            setFilteredUsers(users);
        } catch (error) {
            console.error(error);
        }
    }

    async function orderByAscUser() {
        try {
            const sortedUsers = [...users].sort((a, b) =>
                a.user > b.user ? 1 : -1
            );
            const filteredSortedUsers = sortedUsers.filter((s) =>
                s.user.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filteredSortedUsers);
        } catch (error) {
            console.error(error);
        }
    }

    async function orderByDescUser() {
        try {
            const sortedUsers = [...users].sort((a, b) =>
                a.ALUMNO < b.ALUMNO ? 1 : -1
            );
            const filteredSortedUsers = sortedUsers.filter((s) =>
                s.user.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filteredSortedUsers);
        } catch (error) {
            console.error(error);
        }
    }

    const [isLoadingTable, setIsLoadingTable] = useState(true);
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
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingTable(false);
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
                student.SOCIO_INTEG.toLowerCase().includes(searchTerm) ||
                student.PERIODO.toString().includes(searchTerm) ||
                student.BLOQUE.toString().toLowerCase().includes(searchTerm) ||
                student.MATRICULA.toString().toLowerCase().includes(searchTerm) ||
                student.ESTATUS.toLowerCase().includes(searchTerm) ||
                student.TIPO_ALUMNO.toLowerCase().includes(searchTerm) ||
                student.CLAVE_PROGRAMA.toString().toLowerCase().includes(searchTerm) ||
                student.PROGRAMA.toLowerCase().includes(searchTerm) ||
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
                <div className="h-screen bg-base-200 overflow-y-scroll">
                    <div className="m-8 flex justify-end">
                        <h1 className="text-5xl font-bold">Configuración</h1>
                    </div>
                    <div className="m-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-semibold">Acceso</h1>
                            <div className="flex justify-end">
                                <div className="form-control">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="input input-bordered"
                                            value={searchTermUser}
                                            onChange={SearchTermChangeUser}
                                        />
                                        <button className="btn btn-square" onClick={SearchResetUser}>
                                            <i className="fa-solid fa-broom fa-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="btn btn-ghost mask mask-squircle m-2" onClick={orderByAscUser}>
                                <i className="fa-solid fa-arrow-down-a-z fa-lg"></i>
                            </button>
                            <button className="btn btn-ghost mask mask-squircle m-2" onClick={orderByDescUser}>
                                <i className="fa-solid fa-arrow-down-z-a fa-lg"></i>
                            </button>
                            {/* The button to open modal */}
                            <label htmlFor="createuser" className="btn btn-ghost mask mask-squircle m-2">
                                <i className="fa-solid fa-plus fa-lg"></i>
                            </label>
                        </div>
                        {/* Create */}
                        <input type="checkbox" id="createuser" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box relative">
                                <label
                                    htmlFor="createuser"
                                    className="btn btn-ghost mask mask-squircle absolute right-2 top-2">
                                    ✕
                                </label>
                                <div className="card-body">
                                    <form onSubmit={createUser}>
                                        <div className="form-control">
                                            <p className="m-4 card-title">Crear Usuario</p>
                                            <input placeholder="Usuario"
                                                value={selectedUser.user}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedUser({ ...selectedUser, user: e.target.value })}
                                                type='text' />
                                            <input placeholder="Contraseña"
                                                value={selectedUser.password}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                                type='password' />
                                            <input placeholder="Rol"
                                                value={selectedUser.role}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                                type='password' />
                                        </div>
                                        <div className="m-4 form-control">
                                            <button
                                                type='submit'
                                                className="btn btn-ghost text-white bg-orange-600 hover:bg-orange-600">
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto overflow-y-scroll max-h-96 rounded-lg shadow-xl bg-base-100">
                            {filteredUsers.map((user, index) => (
                                <div key={index} className="m-8 flex items-center justify-between border-b border-orange-600 py-4">
                                    <div className="flex items-center">
                                        <div className="m-4 mask mask-squircle bg-orange-600 h-10 w-10 flex items-center justify-center text-white">
                                            {user.user.charAt(0)}
                                        </div>
                                        <div className="ml-2">
                                            <p className="font-bold">{user.user}</p>
                                            <p>Contraseña: {user.password}</p>
                                            <p>Rol: {user.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <label
                                            htmlFor={`updateuser${user._id}`}
                                            className="m-2 btn btn-ghost mask mask-squircle">
                                            <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                        </label>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="m-2 btn btn-ghost mask mask-squircle">
                                            <i className="fa-solid fa-trash fa-lg"></i>
                                        </button>
                                    </div>
                                    {/* Update */}
                                    <input type="checkbox" id={`updateuser${user._id}`} className="modal-toggle" />
                                    <div className="modal">
                                        <div className="modal-box relative">
                                            <label
                                                htmlFor={`updateuser${user._id}`}
                                                className="btn btn-ghost mask mask-squircle absolute right-2 top-2">
                                                ✕
                                            </label>
                                            <div className="card-body">
                                                <form onSubmit={(e) => { e.preventDefault(); updateUser(user._id, selectedUser); }}>
                                                    <div className="form-control">
                                                        <p className="card-title">Actualizar Usuario</p>
                                                        <label className="label">
                                                            <span className="label-text">Usuario</span>
                                                        </label>
                                                        <input
                                                            placeholder={user.user}
                                                            value={selectedUser.user}
                                                            className="input input-bordered"
                                                            onChange={(e) => setSelectedUser({ ...selectedUser, user: e.target.value })}
                                                            type='text' />
                                                        <label className="label">
                                                            <span className="label-text">Contraseña</span>
                                                        </label>
                                                        <input
                                                            placeholder={user.password}
                                                            value={selectedUser.password}
                                                            className="input input-bordered"
                                                            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                                            type='password' />
                                                        <label className="label">
                                                            <span className="label-text">Rol</span>
                                                        </label>
                                                        <input
                                                            placeholder={user.role}
                                                            value={selectedUser.role}
                                                            className="input input-bordered"
                                                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                                            type='password' />
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
                        </div>
                        <div className="m-2 flex items-center justify-end">
                            <p className="text-sm">Registros: {users.length}</p>
                            <button
                                className="ml-2 btn btn-ghost mask mask-squircle"
                                onClick={deletedAllUsers}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <div className="m-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-semibold">Base de Datos</h1>
                            <div className="flex justify-end">
                                <div className="form-control">
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
                        </div>
                        <div className="flex justify-end">
                            <button className="btn btn-ghost mask mask-squircle m-2" onClick={orderByAsc}>
                                <i className="fa-solid fa-arrow-down-a-z fa-lg"></i>
                            </button>
                            <button className="btn btn-ghost mask mask-squircle m-2" onClick={orderByDesc}>
                                <i className="fa-solid fa-arrow-down-z-a fa-lg"></i>
                            </button>
                            {/* The button to open modal */}
                            <label htmlFor="download" className="btn btn-ghost mask mask-squircle m-2">
                                <i className="fa-solid fa-file-arrow-down fa-lg"></i>
                            </label>
                            {/* Put this part before </body> tag */}
                            <input type="checkbox"
                                id="download"
                                className="modal-toggle" />
                            <div className="modal fixed z-50 inset-0 overflow-y-auto">
                                <div className="modal-box relative mx-auto max-w-xs">
                                    <p className="m-4 card-title">Descargar Datos</p>
                                    <label htmlFor="download"
                                        className="btn btn-ghost mask mask-squircle absolute right-2 top-2">
                                        ✕
                                    </label>
                                    <div className="form-control">
                                        <div className="m-4 input-group">
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
                            <label htmlFor="create" className="btn btn-ghost mask mask-squircle m-2">
                                <i className="fa-solid fa-plus fa-lg"></i>
                            </label>
                        </div>
                        {/* Create */}
                        <input type="checkbox" id="create" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box relative">
                                <label
                                    htmlFor="create"
                                    className="btn btn-ghost mask mask-squircle absolute right-2 top-2">
                                    ✕
                                </label>
                                <div className="card-body">
                                    <p className="m-4 card-title">Subir Archivo</p>
                                    <div>
                                        <input
                                            type="file"
                                            className="file-input file-input-bordered w-full max-w-xs"
                                            onChange={uploadFile} />
                                        <button
                                            className="ml-4">
                                            <i className="fa-solid fa-file-arrow-up fa-xl"></i>
                                        </button>
                                    </div>
                                    <div className="divider">Ó</div>
                                    <p className="m-4 card-title">Crear Estudiante</p>
                                    <form onSubmit={createStudent}>
                                        <div className="form-control">
                                            <input placeholder="Campus"
                                                value={selectedStudent.CAMPUS}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, CAMPUS: e.target.value })}
                                                type='text' />
                                            <input placeholder="Nivel"
                                                value={selectedStudent.NIVEL}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, NIVEL: e.target.value })}
                                                type='text' />
                                            <input placeholder="Parte Periodo"
                                                value={selectedStudent.PARTE_PERIODO}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, PARTE_PERIODO: e.target.value })}
                                                type='text' />
                                            <input placeholder="CRN"
                                                value={selectedStudent.CRN}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, CRN: e.target.value })}
                                                type='number' />
                                            <input placeholder="Clave Materia"
                                                value={selectedStudent.CLAVE_MATERIA}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_MATERIA: e.target.value })}
                                                type='text' />
                                            <input placeholder="Materia"
                                                value={selectedStudent.MATERIA}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, MATERIA: e.target.value })}
                                                type='text' />
                                            <input placeholder="Socio Integ"
                                                value={selectedStudent.SOCIO_INTEG}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, SOCIO_INTEG: e.target.value })}
                                                type='text' />
                                            <input placeholder="Periodo"
                                                value={selectedStudent.PERIODO}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, PERIODO: e.target.value })}
                                                type='number' />
                                            <input placeholder="Bloque"
                                                value={selectedStudent.BLOQUE}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, BLOQUE: e.target.value })}
                                                type='text' />
                                            <input placeholder="Matricula"
                                                value={selectedStudent.MATRICULA}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, MATRICULA: e.target.value })}
                                                type='number' />
                                            <input placeholder="Alumno"
                                                value={selectedStudent.ALUMNO}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, ALUMNO: e.target.value })}
                                                type='text' />
                                            <input placeholder="Estatus"
                                                value={selectedStudent.ESTATUS}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, ESTATUS: e.target.value })}
                                                type='text' />
                                            <input placeholder="Tipo Alumno"
                                                value={selectedStudent.TIPO_ALUMNO}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, TIPO_ALUMNO: e.target.value })}
                                                type='text' />
                                            <input placeholder="Clave Programa"
                                                value={selectedStudent.CLAVE_PROGRAMA}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_PROGRAMA: e.target.value })}
                                                type='text' />
                                            <input placeholder="Programa"
                                                value={selectedStudent.PROGRAMA}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, PROGRAMA: e.target.value })}
                                                type='text' />
                                            <input placeholder="Docente"
                                                value={selectedStudent.DOCENTE}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, DOCENTE: e.target.value })}
                                                type='text' />
                                            <input placeholder="Correo Pref"
                                                value={selectedStudent.CORREO_PREF}
                                                className="m-4 input input-bordered"
                                                onChange={(e) => setSelectedStudent({ ...selectedStudent, CORREO_PREF: e.target.value })}
                                                type='text' />
                                        </div>
                                        <div className="m-4 form-control">
                                            <button
                                                type='submit'
                                                className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-600">
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto overflow-y-scroll max-h-96 rounded-lg shadow-xl bg-base-100">
                            {isLoadingTable ? (
                                <div className="flex items-center justify-center h-screen">
                                    <div className="btn btn-square loading"></div>
                                </div>
                            ) : (
                                <table className="table-compact w-full tex-sm">
                                    <thead>
                                        <tr className="text-center text-white">
                                            <th className="bg-orange-600">CAMPUS</th>
                                            <th className="bg-orange-600">NIVEL</th>
                                            <th className="bg-orange-600">PARTE_PERIODO</th>
                                            <th className="bg-orange-600">CRN</th>
                                            <th className="bg-orange-600">SOCIO_INTEG</th>
                                            <th className="bg-orange-600">PERIODO</th>
                                            <th className="bg-orange-600">BLOQUE</th>
                                            <th className="bg-orange-600">MATRICULA</th>
                                            <th className="bg-orange-600">ALUMNO</th>
                                            <th className="bg-orange-600">ESTATUS</th>
                                            <th className="bg-orange-600">TIPO_ALUMNO</th>
                                            <th className="bg-orange-600">CLAVE_PROGRAMA</th>
                                            <th className="bg-orange-600">PROGRAMA</th>
                                            <th className="bg-orange-600">CORREO_PREF</th>
                                            <th className="bg-orange-600"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map((student, index) => (
                                            <tr key={index} className="border-b border-orange-600 py-4">
                                                <td>{student.CAMPUS}</td>
                                                <td>{student.NIVEL}</td>
                                                <td>{student.PARTE_PERIODO}</td>
                                                <td>{student.CRN}</td>
                                                <td>{student.SOCIO_INTEG}</td>
                                                <td>{student.PERIODO}</td>
                                                <td>{student.BLOQUE}</td>
                                                <td>{student.MATRICULA}</td>
                                                <td>{student.ALUMNO}</td>
                                                <td>{student.ESTATUS}</td>
                                                <td>{student.TIPO_ALUMNO}</td>
                                                <td>{student.CLAVE_PROGRAMA}</td>
                                                <td>{student.PROGRAMA}</td>
                                                <td>{student.CORREO_PREF}</td>
                                                <td className="flex">
                                                    <label
                                                        htmlFor={`update${student._id}`}
                                                        className="m-2 btn btn-ghost mask mask-squircle">
                                                        <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                                    </label>
                                                    {/* Update */}
                                                    <input type="checkbox" id={`update${student._id}`} className="modal-toggle" />
                                                    <div className="modal">
                                                        <div className="modal-box relative">
                                                            <label htmlFor={`update${student._id}`} className="btn btn-ghost mask mask-squircle absolute right-2 top-2">✕</label>
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
                                                    <button
                                                        onClick={() => deletedStudent(student._id)}
                                                        className="m-2 btn btn-ghost mask mask-squircle">
                                                        <i className="fa-solid fa-trash fa-lg"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="m-2 flex items-center justify-end">
                            <p className="text-sm">Registros: {students.length}</p>
                            <button
                                className="ml-2 btn btn-ghost mask mask-squircle"
                                onClick={deletedAllStudents}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div >
                </div>
            )}
        </>
    )
};

export default Users;