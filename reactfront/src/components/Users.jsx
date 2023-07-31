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
        name: '',
        user: '',
        password: '',
        role: 'administrador'
    });
    const [passwordProgress, setPasswordProgress] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null);
    const [filename, setFileName] = useState('');
    const { id } = useParams();
    const [showError, setShowError] = useState(false);

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
            const token = localStorage.getItem('token');
            const response = await axios.get(URIUSER, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

    function resetSelectedUser() {
        setSelectedUser({
            name: '',
            user: '',
            password: '',
            role: 'administrador'
        });
        setPasswordProgress(0);
        setShowError(false);
    }

    function generateRandomUsername(name) {
        const length = 8; // Longitud del nombre de usuario
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Caracteres permitidos

        // Eliminar espacios y convertir a minúsculas
        const nameWithoutSpaces = name.replace(/\s/g, '').toLowerCase();

        let result = '';

        // Tomar los primeros caracteres del nombre para formar el nombre de usuario
        for (let i = 0; i < Math.min(length, nameWithoutSpaces.length); i++) {
            result += nameWithoutSpaces[i];
        }

        // Si el nombre de usuario ya tiene la longitud deseada, retornarlo
        if (result.length === length) {
            return result;
        }

        // Si el nombre de usuario es más corto que la longitud deseada, completarlo con caracteres aleatorios
        for (let i = result.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            result += charset[randomIndex];
        }

        return result;
    };

    // Función para validar la contraseña y calcular el progreso
    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>?]/.test(password);
        const hasMinimumLength = password.length >= 8;

        const progress = (hasUppercase + hasNumber + hasSpecialChar + hasMinimumLength) * 25; // Cada requisito aporta 25% al progreso total

        return progress;
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const progress = validatePassword(password);
        setPasswordProgress(progress);
        setSelectedUser({ ...selectedUser, password });
    };

    const getPasswordStatusText = () => {
        if (passwordProgress >= 100) {
            return 'Contraseña segura';
        }

        const hasUppercase = /[A-Z]/.test(selectedUser.password);
        const hasNumber = /\d/.test(selectedUser.password);
        const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>?]/.test(selectedUser.password);
        const hasMinimumLength = selectedUser.password.length >= 8;

        let statusText = '';

        if (!hasMinimumLength) {
            statusText += ' - Debe tener al menos 8 caracteres ';
        }
        if (!hasUppercase) {
            statusText += ' - Debe tener al menos una mayúscula ';
        }

        if (!hasNumber) {
            statusText += ' - Debe tener al menos un número ';
        }

        if (!hasSpecialChar) {
            statusText += ' - Debe tener al menos un carácter especial ';
        }
        return statusText;
    };

    async function createUser(e) {
        e.preventDefault();
        if (!selectedUser.name || !selectedUser.password) {
            setShowError(true);
            return;
        }

        // Si no se proporciona un nombre de usuario, generamos uno basado en el nombre
        if (!selectedUser.user || selectedUser.user === '') {
            selectedUser.user = generateRandomUsername(selectedUser.name);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(URIUSER, selectedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers((users) => [...users, response.data]);
            resetSelectedUser();
            document.getElementById('createuser').checked = false;
            getUsers();
            showError(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function updateUser(id, user) {
        try {
            const token = localStorage.getItem('token');
            // Obtener los datos actuales del usuario antes de la actualización
            const currentUser = await axios.get(`${URIUSER}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedUser = { ...currentUser.data, ...user }; // Combinar los datos actuales con los nuevos datos proporcionados

            // Reemplazar campos vacíos en el objeto updatedUser con los valores actuales del usuario
            if (!updatedUser.name || updatedUser.name === '') {
                updatedUser.name = currentUser.data.name;
            }
            if (!updatedUser.user || updatedUser.user === '') {
                updatedUser.user = currentUser.data.user;
            }
            if (!updatedUser.password || updatedUser.password === '') {
                updatedUser.password = currentUser.data.password;
            }

            const response = await axios.put(`${URIUSER}/${id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers((users) =>
                users.map((user) => (user._id === id ? response.data : user))
            );
            document.getElementById(`updateuser${id}`).checked = false;
            resetSelectedUser();
            getUsers();
            showError(false);
        } catch (error) {
            console.error(error);
        }
    }

    function handleDeleteConfirmation(id) {
        setFormToDelete(id);
        setShowConfirmation(true);
    }

    async function deleteUser(id) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${URIUSER}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers((users) => users.filter((user) => user._id !== id));
            getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    async function deletedAllUsers() {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(URIUSER, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
                user.name.toLowerCase().includes(searchTermUser) ||
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
                a.user < b.user ? 1 : -1
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
    const [showConfirmationBD, setShowConfirmationBD] = useState(false);
    const [formToDeleteBD, setFormToDeleteBD] = useState(null);
    const [sendingRating, setSendingRating] = useState(false);

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
            setIsLoadingTable(false);
        }
    };

    function resetSelectedStudent() {
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
        setShowError(false);
    }

    async function createStudent(event) {
        event.preventDefault();
        if (!selectedStudent.CAMPUS || !selectedStudent.NIVEL || !selectedStudent.PARTE_PERIODO || !selectedStudent.CRN || !selectedStudent.CLAVE_MATERIA || !selectedStudent.MATERIA || !selectedStudent.SOCIO_INTEG || !selectedStudent.PERIODO || !selectedStudent.BLOQUE || !selectedStudent.MATRICULA || !selectedStudent.ALUMNO || !selectedStudent.ESTATUS || !selectedStudent.TIPO_ALUMNO || !selectedStudent.CLAVE_PROGRAMA || !selectedStudent.PROGRAMA || !selectedStudent.DOCENTE || !selectedStudent.CORREO_PREF) {
            setShowError(true);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(URI, selectedStudent, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStudents((students) => [...students, response.data]);
            resetSelectedStudent();
            document.getElementById('create').checked = false;
            getStudents();
            showError(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function updateStudent(id, student) {
        try {
            const token = localStorage.getItem('token');
            // Obtener los datos actuales del estudiante antes de la actualización
            const currentStudent = await axios.get(`${URI}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updateStudent = { ...currentStudent.data, ...student }; // Combinar los datos actuales con los nuevos datos proporcionados

            // Reemplazar campos vacíos en el objeto updatedUser con los valores actuales del usuario
            if (!updateStudent.CAMPUS || updateStudent.CAMPUS === '') {
                updateStudent.CAMPUS = currentStudent.data.CAMPUS;
            }
            if (!updateStudent.NIVEL || updateStudent.NIVEL === '') {
                updateStudent.NIVEL = currentStudent.data.NIVEL;
            }
            if (!updateStudent.PARTE_PERIODO || updateStudent.PARTE_PERIODO === '') {
                updateStudent.PARTE_PERIODO = currentStudent.data.PARTE_PERIODO;
            }
            if (!updateStudent.CRN || updateStudent.CRN === '') {
                updateStudent.CRN = currentStudent.data.CRN;
            }
            if (!updateStudent.SOCIO_INTEG || updateStudent.SOCIO_INTEG === '') {
                updateStudent.SOCIO_INTEG = currentStudent.data.SOCIO_INTEG;
            }
            if (!updateStudent.PERIODO || updateStudent.PERIODO === '') {
                updateStudent.PERIODO = currentStudent.data.PERIODO;
            }
            if (!updateStudent.BLOQUE || updateStudent.BLOQUE === '') {
                updateStudent.BLOQUE = currentStudent.data.BLOQUE;
            }
            if (!updateStudent.MATRICULA || updateStudent.MATRICULA === '') {
                updateStudent.MATRICULA = currentStudent.data.MATRICULA;
            }
            if (!updateStudent.ALUMNO || updateStudent.ALUMNO === '') {
                updateStudent.ALUMNO = currentStudent.data.ALUMNO;
            }
            if (!updateStudent.ESTATUS || updateStudent.ESTATUS === '') {
                updateStudent.ESTATUS = currentStudent.data.ESTATUS;
            }
            if (!updateStudent.TIPO_ALUMNO || updateStudent.TIPO_ALUMNO === '') {
                updateStudent.TIPO_ALUMNO = currentStudent.data.TIPO_ALUMNO;
            }
            if (!updateStudent.CLAVE_PROGRAMA || updateStudent.CLAVE_PROGRAMA === '') {
                updateStudent.CLAVE_PROGRAMA = currentStudent.data.CLAVE_PROGRAMA;
            }
            if (!updateStudent.PROGRAMA || updateStudent.PROGRAMA === '') {
                updateStudent.PROGRAMA = currentStudent.data.PROGRAMA;
            }
            if (!updateStudent.CORREO_PREF || updateStudent.CORREO_PREF === '') {
                updateStudent.CORREO_PREF = currentStudent.data.CORREO_PREF;
            }

            const response = await axios.put(`${URI}/${id}`, updateStudent, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStudents((students) =>
                students.map((s) => (s._id === id ? response.data : s))
            );
            document.getElementById(`update${id}`).checked = false;
            resetSelectedStudent();
            setShowError(false);
            getStudents();
        } catch (error) {
            console.error(error);
        }
    }

    function handleDeleteConfirmationBD(id) {
        setFormToDeleteBD(id);
        setShowConfirmationBD(true);
    }

    async function deletedStudent(id) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${URI}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStudents((students) => students.filter((student) => student._id !== id));
            getStudents();
        } catch (error) {
            console.error(error);
        }
    }

    async function deletedAllStudents() {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(URI, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStudents([]);
            getStudents();
        } catch (error) {
            console.error(error);
        }
    }

    async function uploadFile(event) {
        event.preventDefault();
        const file = event.target.files[0];
        if (!file) {
            setShowError(true);
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
            const token = localStorage.getItem('token');
            setSendingRating(true);
            const response = await axios.post(`${URI}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (Array.isArray(response.data)) {
                setStudents(response.data);
            }
            document.getElementById('create').checked = false;
            getStudents();
            event.target.value = null;
        } catch (error) {
            console.error(error);
        } finally {
            setSendingRating(false);
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

    const FileChange = (e) => {
        setFileName(e.target.value);
    };

    const clearFileName = () => {
        setFileName('');
    };

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
            document.getElementById('download').checked = false;
            clearFileName();
            resetSelectedStudent();
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
                <div className="h-screen w-screen bg-base-200 overflow-y-auto overflow-x-auto">
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
                                        <button className="btn btn-square hover:bg-orange-600 hover:text-white" onClick={SearchResetUser}>
                                            <i className="fa-solid fa-broom fa-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 mb-4 flex justify-end">
                            <button className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white" onClick={orderByAscUser}>
                                <i className="fa-solid fa-arrow-down-a-z fa-lg"></i>
                            </button>
                            <button className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white" onClick={orderByDescUser}>
                                <i className="fa-solid fa-arrow-down-z-a fa-lg"></i>
                            </button>
                            <label
                                htmlFor="createuser"
                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-plus fa-lg"></i>
                            </label>
                        </div>
                        <input
                            type="checkbox" id="createuser" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box">
                                <div className="modal-action">
                                    <label
                                        htmlFor="createuser"
                                        className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                        onClick={() => {
                                            resetSelectedUser();
                                            setShowError(false);
                                        }}>
                                        ✕
                                    </label>
                                </div>
                                {showError ? (
                                    <div className="alert alert-error shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Completa todos los campos.</span>
                                    </div>
                                ) : null}
                                <form
                                    className="mr-8 ml-8 form-control"
                                    onSubmit={createUser}>
                                    <p className="mb-8 card-title">Crear Usuario</p>
                                    <input placeholder="Nombre"
                                        value={selectedUser.name}
                                        className="mb-4 input input-bordered w-full"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                        type='text' />
                                    <input placeholder="Usuario"
                                        value={selectedUser.user}
                                        className="mb-4 input input-bordered w-full"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, user: e.target.value })}
                                        type='text' />
                                    <div className="mb-4">
                                        <input placeholder="Contraseña"
                                            value={selectedUser.password}
                                            className="input input-bordered w-full"
                                            onChange={handlePasswordChange}
                                            type='password' />
                                        <progress className="my-4 progress progress-accent w-56" value={passwordProgress} max="100"></progress>
                                        <p className="text-sm">{getPasswordStatusText()}</p>
                                    </div>
                                    <input placeholder="Rol"
                                        value={selectedUser.role}
                                        className="mb-8 input input-bordered w-full"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                        type='text'
                                        disabled />
                                    <button
                                        type='submit'
                                        className="btn btn-ghost text-white bg-orange-600 hover:bg-orange-700">
                                        Guardar
                                    </button>
                                </form>
                            </div>
                        </div>
                        {showConfirmation && (
                            <div className="mt-2 mb-2 alert">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {formToDelete ? (
                                    <div>
                                        <span>¿Estás seguro de que deseas eliminar este usuario?</span>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost"
                                            onClick={() => setShowConfirmation(false)}>
                                            Cancelar
                                        </button>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost hover:bg-red-600 hover:text-white"
                                            onClick={() => {
                                                deleteUser(formToDelete);
                                                setShowConfirmation(false);
                                            }}>
                                            Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <span>¿Estás seguro de que deseas eliminar todos los usuarios?</span>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost"
                                            onClick={() => setShowConfirmation(false)}>
                                            Cancelar
                                        </button>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost hover:bg-red-600 hover:text-white"
                                            onClick={() => {
                                                deletedAllUsers();
                                                setShowConfirmation(false);
                                            }}>
                                            Eliminar todos
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="overflow-x-auto overflow-y-auto max-h-96 rounded-lg shadow-xl bg-base-100">
                            {filteredUsers.map((user, index) => (
                                <div key={index} className="m-4 flex items-center justify-between border-b border-orange-600 p-4">
                                    <div className="flex items-center">
                                        <div className="m-4 mask mask-squircle bg-orange-600 h-10 w-10 flex items-center justify-center text-white">
                                            {user.user.charAt(0)}
                                        </div>
                                        <div className="ml-2">
                                            <p className="font-bold">{user.user}</p>
                                            <p>{user.name}</p>
                                            <p>{user.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <label
                                            htmlFor={`updateuser${user._id}`}
                                            className="m-2 btn btn-ghost mask mask-squircle hover:bg-yellow-500 hover:text-white">
                                            <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                        </label>
                                        <button
                                            onClick={() => handleDeleteConfirmation(user._id)}
                                            className="m-2 btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white">
                                            <i className="fa-solid fa-trash fa-lg"></i>
                                        </button>
                                    </div>
                                    {/* Update */}
                                    <input type="checkbox" id={`updateuser${user._id}`} className="modal-toggle" />
                                    <div className="modal">
                                        <div className="mr-8 ml-8 modal-box">
                                            <div className="modal-action">
                                                <label
                                                    htmlFor={`updateuser${user._id}`}
                                                    className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                    onClick={() => {
                                                        resetSelectedUser();
                                                        setShowError(false);
                                                    }}>
                                                    ✕
                                                </label>
                                            </div>
                                            {showError ? (
                                                <div className="alert alert-error shadow-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <span>Completa todos los campos.</span>
                                                </div>
                                            ) : null}
                                            <form
                                                className="form-control"
                                                onSubmit={(e) => { e.preventDefault(); updateUser(user._id, selectedUser); }}>
                                                <p className="mb-8 card-title">Actualizar Usuario</p>
                                                <label className="label">
                                                    <span className="label-text">Nombre</span>
                                                </label>
                                                <input
                                                    placeholder={user.name}
                                                    value={selectedUser.name}
                                                    className="mb-4 input input-bordered w-full"
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                                    type='text' />
                                                <label className="label">
                                                    <span className="label-text">Usuario</span>
                                                </label>
                                                <input
                                                    placeholder={user.user}
                                                    value={selectedUser.user}
                                                    className="mb-4 input input-bordered w-full"
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, user: e.target.value })}
                                                    type='text' />
                                                <label className="label">
                                                    <span className="label-text">Contraseña</span>
                                                </label>
                                                <input
                                                    placeholder='***'
                                                    value={selectedUser.password}
                                                    className="mb-4 input input-bordered w-full"
                                                    onChange={handlePasswordChange}
                                                    type='password' />
                                                <progress className="mb-8 progress progress-accent w-56" value={passwordProgress} max="100"></progress>
                                                <p className="text-sm">{getPasswordStatusText()}</p>
                                                <label className="label">
                                                    <span className="label-text">Rol</span>
                                                </label>
                                                <input
                                                    placeholder={user.role}
                                                    value={selectedUser.role}
                                                    className="mb-8 input input-bordered w-full"
                                                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                                    type='text'
                                                    disabled />
                                                <button type='submit'
                                                    className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-700">
                                                    Actualizar
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="m-2 flex justify-end items-center">
                            <p className="text-sm">Registros: {users.length}</p>
                            <button
                                className="ml-2 btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                onClick={() => {
                                    setShowConfirmation(true);
                                    setFormToDelete(null);
                                }}>
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
                                        <button className="btn btn-square hover:bg-orange-600 hover:text-white" onClick={SearchReset}>
                                            <i className="fa-solid fa-broom fa-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 mb-4 flex justify-end">
                            <button className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white" onClick={orderByAsc}>
                                <i className="fa-solid fa-arrow-down-a-z fa-lg"></i>
                            </button>
                            <button className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white" onClick={orderByDesc}>
                                <i className="fa-solid fa-arrow-down-z-a fa-lg"></i>
                            </button>
                            <label htmlFor="download" className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-file-arrow-down fa-lg"></i>
                            </label>
                            <input type="checkbox"
                                id="download"
                                className="modal-toggle" />
                            <div className="modal">
                                <div className="modal-box">
                                    <div className="modal-action">
                                        <label htmlFor="download"
                                            className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                            onClick={clearFileName}>
                                            ✕
                                        </label>
                                    </div>
                                    <div className="mr-8 ml-8 ">
                                        <p className="mb-8 card-title">Descargar Datos</p>
                                        <div className="input-group">
                                            <input
                                                id="filename"
                                                type="text"
                                                placeholder="Nombre del Archivo"
                                                className="input input-bordered w-full"
                                                value={filename}
                                                onChange={FileChange}
                                            />
                                            <button
                                                className="btn btn-square hover:bg-orange-600 hover:text-white"
                                                onClick={Download}>
                                                <i className="fa-solid fa-download fa lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label
                                htmlFor="create"
                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-plus fa-lg"></i>
                            </label>
                        </div>
                        <input type="checkbox" id="create" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box">
                                <div className="modal-action">
                                    <label
                                        htmlFor="create"
                                        className=" absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                        onClick={() => {
                                            resetSelectedStudent();
                                            setShowError(false);
                                        }}>
                                        ✕
                                    </label>
                                </div>
                                {showError ? (
                                    <div className="alert alert-error shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Completa todos los campos.</span>
                                    </div>
                                ) : null}
                                <div className="mr-8 ml-8">
                                    <p className="mb-8 card-title">Subir Archivo</p>
                                    <div className="mb-4 flex justify-between items-center">
                                        <input
                                            type="file"
                                            accept=".xlsx"
                                            className="file-input file-input-bordered w-full max-w-xs"
                                            onChange={uploadFile} />
                                        <button
                                            className={`btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end ${sendingRating ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            disabled={sendingRating}>
                                            <i className="fa-solid fa-file-arrow-up fa-xl"></i>
                                        </button>
                                    </div>
                                    <div className="mb-4 divider">Ó</div>
                                    <p className="mb-8 card-title">Crear Estudiante</p>
                                    <form
                                        className="form-control"
                                        onSubmit={createStudent}>
                                        <input placeholder="Campus"
                                            value={selectedStudent.CAMPUS}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CAMPUS: e.target.value })}
                                            type='text' />
                                        <input placeholder="Nivel"
                                            value={selectedStudent.NIVEL}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, NIVEL: e.target.value })}
                                            type='text' />
                                        <input placeholder="Parte Periodo"
                                            value={selectedStudent.PARTE_PERIODO}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, PARTE_PERIODO: e.target.value })}
                                            type='text' />
                                        <input placeholder="CRN"
                                            value={selectedStudent.CRN}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CRN: e.target.value })}
                                            type='number' />
                                        <input placeholder="Clave Materia"
                                            value={selectedStudent.CLAVE_MATERIA}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_MATERIA: e.target.value })}
                                            type='text' />
                                        <input placeholder="Materia"
                                            value={selectedStudent.MATERIA}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, MATERIA: e.target.value })}
                                            type='text' />
                                        <input placeholder="Socio Integ"
                                            value={selectedStudent.SOCIO_INTEG}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, SOCIO_INTEG: e.target.value })}
                                            type='text' />
                                        <input placeholder="Periodo"
                                            value={selectedStudent.PERIODO}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, PERIODO: e.target.value })}
                                            type='number' />
                                        <input placeholder="Bloque"
                                            value={selectedStudent.BLOQUE}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, BLOQUE: e.target.value })}
                                            type='text' />
                                        <input placeholder="Matricula"
                                            value={selectedStudent.MATRICULA}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, MATRICULA: e.target.value })}
                                            type='number' />
                                        <input placeholder="Alumno"
                                            value={selectedStudent.ALUMNO}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, ALUMNO: e.target.value })}
                                            type='text' />
                                        <input placeholder="Estatus"
                                            value={selectedStudent.ESTATUS}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, ESTATUS: e.target.value })}
                                            type='text' />
                                        <input placeholder="Tipo Alumno"
                                            value={selectedStudent.TIPO_ALUMNO}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, TIPO_ALUMNO: e.target.value })}
                                            type='text' />
                                        <input placeholder="Clave Programa"
                                            value={selectedStudent.CLAVE_PROGRAMA}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_PROGRAMA: e.target.value })}
                                            type='text' />
                                        <input placeholder="Programa"
                                            value={selectedStudent.PROGRAMA}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, PROGRAMA: e.target.value })}
                                            type='text' />
                                        <input placeholder="Docente"
                                            value={selectedStudent.DOCENTE}
                                            className="mb-4 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, DOCENTE: e.target.value })}
                                            type='text' />
                                        <input placeholder="Correo Pref"
                                            value={selectedStudent.CORREO_PREF}
                                            className="mb-8 input input-bordered w-full"
                                            onChange={(e) => setSelectedStudent({ ...selectedStudent, CORREO_PREF: e.target.value })}
                                            type='text' />
                                        <button
                                            type='submit'
                                            className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-600 w-full">
                                            Guardar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {showConfirmationBD && (
                            <div className="mt-2 mb-2 alert">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {formToDeleteBD ? (
                                    <div>
                                        <span>¿Estás seguro de que deseas eliminar este alumno?</span>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost"
                                            onClick={() => setShowConfirmationBD(false)}>
                                            Cancelar
                                        </button>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost hover:bg-red-600 hover:text-white"
                                            onClick={() => {
                                                deletedStudent(formToDeleteBD);
                                                setShowConfirmationBD(false);
                                            }}>
                                            Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <span>¿Estás seguro de que deseas eliminar todos los estudiantes?</span>
                                        <button
                                            className="ml-2 btn btn-sm btn-ghost"
                                            onClick={() => setShowConfirmationBD(false)}>
                                            Cancelar
                                        </button>
                                        <button className="ml-2 btn btn-sm btn-ghost hover:bg-red-600 hover:text-white" onClick={() => {
                                            deletedAllStudents();
                                            setShowConfirmationBD(false);
                                        }}>Eliminar todos</button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="overflow-x-auto overflow-y-auto max-h-96 rounded-lg shadow-xl bg-base-100">
                            {isLoadingTable ? (
                                <div className="flex items-center justify-center h-screen">
                                    <div className="btn btn-square loading"></div>
                                </div>
                            ) : (
                                <table className="table table-xs tex-sm">
                                    <thead className="sticky top-0 bg-orange-600 text-center text-white">
                                        <tr>
                                            <th>CAMPUS</th>
                                            <th>NIVEL</th>
                                            <th>PARTE_PERIODO</th>
                                            <th>CRN</th>
                                            <th>SOCIO_INTEG</th>
                                            <th>PERIODO</th>
                                            <th>BLOQUE</th>
                                            <th>MATRICULA</th>
                                            <th>ALUMNO</th>
                                            <th>ESTATUS</th>
                                            <th>TIPO_ALUMNO</th>
                                            <th>CLAVE_PROGRAMA</th>
                                            <th>PROGRAMA</th>
                                            <th>CORREO_PREF</th>
                                            <th>Editar</th>
                                            <th>Eliminar</th>
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
                                                <td>
                                                    <label
                                                        htmlFor={`update${student._id}`}
                                                        className="m-2 btn btn-ghost mask mask-squircle hover:bg-yellow-500 hover:text-white">
                                                        <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                                    </label>
                                                    {/* Update */}
                                                    <input type="checkbox" id={`update${student._id}`} className="modal-toggle" />
                                                    <div className="modal">
                                                        <div className="modal-box relative">
                                                            <div className="modal-action">
                                                                <label
                                                                    htmlFor={`update${student._id}`}
                                                                    className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                                                    onClick={() => {
                                                                        resetSelectedStudent();
                                                                        setShowError(false);
                                                                    }}>
                                                                    ✕
                                                                </label>
                                                            </div>
                                                            {showError ? (
                                                                <div className="alert alert-error shadow-lg">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    <span>Completa todos los campos.</span>
                                                                </div>
                                                            ) : null}
                                                            <form
                                                                className="mr-8 ml-8 form-control"
                                                                onSubmit={(e) => { e.preventDefault(); updateStudent(student._id, selectedStudent); }}>
                                                                <p className="mb-8 card-title">Actualizar Estudiante</p>
                                                                <label className="label">
                                                                    <span className="label-text">Campus</span>
                                                                </label>
                                                                <input placeholder={student.CAMPUS}
                                                                    value={selectedStudent.CAMPUS}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CAMPUS: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Nivel</span>
                                                                </label>
                                                                <input placeholder={student.NIVEL}
                                                                    value={selectedStudent.NIVEL}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, NIVEL: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Parte Periodo</span>
                                                                </label>
                                                                <input placeholder={student.PARTE_PERIODO}
                                                                    value={selectedStudent.PARTE_PERIODO}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, PARTE_PERIODO: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">CRN</span>
                                                                </label>
                                                                <input placeholder={student.CRN}
                                                                    value={selectedStudent.CRN}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CRN: e.target.value })}
                                                                    type='number' />
                                                                <label className="label">
                                                                    <span className="label-text">Socio Integ</span>
                                                                </label>
                                                                <input placeholder={student.SOCIO_INTEG}
                                                                    value={selectedStudent.SOCIO_INTEG}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, SOCIO_INTEG: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Periodo</span>
                                                                </label>
                                                                <input placeholder={student.PERIODO}
                                                                    value={selectedStudent.PERIODO}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, PERIODO: e.target.value })}
                                                                    type='number' />
                                                                <label className="label">
                                                                    <span className="label-text">Bloque</span>
                                                                </label>
                                                                <input placeholder={student.BLOQUE}
                                                                    value={selectedStudent.BLOQUE}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, BLOQUE: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Matriculo</span>
                                                                </label>
                                                                <input placeholder={student.MATRICULA}
                                                                    value={selectedStudent.MATRICULA}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, MATRICULA: e.target.value })}
                                                                    type='number' />
                                                                <label className="label">
                                                                    <span className="label-text">Alumno</span>
                                                                </label>
                                                                <input placeholder={student.ALUMNO}
                                                                    value={selectedStudent.ALUMNO}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, ALUMNO: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Estatus</span>
                                                                </label>
                                                                <input placeholder={student.ESTATUS}
                                                                    value={selectedStudent.ESTATUS}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, ESTATUS: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Tipo Alumno</span>
                                                                </label>
                                                                <input placeholder={student.TIPO_ALUMNO}
                                                                    value={selectedStudent.TIPO_ALUMNO}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, TIPO_ALUMNO: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Clave Programa</span>
                                                                </label>
                                                                <input placeholder={student.CLAVE_PROGRAMA}
                                                                    value={selectedStudent.CLAVE_PROGRAMA}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CLAVE_PROGRAMA: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Programa</span>
                                                                </label>
                                                                <input placeholder={student.PROGRAMA}
                                                                    value={selectedStudent.PROGRAMA}
                                                                    className="mb-4 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, PROGRAMA: e.target.value })}
                                                                    type='text' />
                                                                <label className="label">
                                                                    <span className="label-text">Correo Pref</span>
                                                                </label>
                                                                <input placeholder={student.CORREO_PREF}
                                                                    value={selectedStudent.CORREO_PREF}
                                                                    className="mb-8 input input-bordered w-full"
                                                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, CORREO_PREF: e.target.value })}
                                                                    type='text' />
                                                                <button
                                                                    type='submit'
                                                                    className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-400 w-full">Actualizar</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteConfirmationBD(student._id)}
                                                        className="m-2 btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white">
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
                                className="ml-2 btn btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                                onClick={() => {
                                    setShowConfirmationBD(true);
                                    setFormToDeleteBD(null);
                                }}>
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