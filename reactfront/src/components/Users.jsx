import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/users';

const Users = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({ user: '', password: '' });
    const { id } = useParams();

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        async function getUserById() {
            try {
                const response = await axios.get(`${URI}/${id}`);
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
            const response = await axios.get(URI);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
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
            const response = await axios.post(URI, selectedUser);
            setUsers((users) => [...users, response.data]);
            setSelectedUser({ user: '', password: '' });
            document.getElementById('create').checked = false;
            getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    async function updateUser(id, user) {
        try {
            const response = await axios.put(`${URI}/${id}`, user);
            setUsers((users) =>
                users.map((user) => (user._id === id ? response.data : user))
            );
            document.getElementById(`update${id}`).checked = false;
            getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteUser(id) {
        try {
            await axios.delete(`${URI}/${id}`);
            setUsers((users) => users.filter((user) => user._id !== id));
            getUsers();
        } catch (error) {
            console.log(error);
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
                        <h1 className="text-5xl font-bold m-2">Configuración</h1>
                    </div>
                    <div className="flex justify-end m-2">
                        {/* The button to open modal */}
                        <div className="tooltip tooltip-info" data-tip="Añadir">
                            <label htmlFor="create" className="btn btn-ghost btn-circle hover:border-blue-400 active:border-blue-600">
                                <i className="fa-solid fa-plus"></i>
                            </label>
                        </div>
                    </div>
                    {/* Create */}
                    <input type="checkbox" id="create" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label
                                htmlFor="create"
                                className="btn btn-ghost btn-circle hover:border-red-400 active:border-red-600 absolute right-2 top-2">
                                ✕
                            </label>
                            <div className="card-body">
                                <form onSubmit={createUser}>
                                    <div className="form-control">
                                        <p className="card-title">Crear Usuario</p>
                                        <label className="label">
                                            <span className="label-text">Usuario</span>
                                        </label>
                                        <input placeholder="Usuario"
                                            value={selectedUser.user}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedUser({ ...selectedUser, user: e.target.value })}
                                            type='text' />
                                        <label className="label">
                                            <span className="label-text">Contraseña</span>
                                        </label>
                                        <input placeholder="Contraseña"
                                            value={selectedUser.password}
                                            className="input input-bordered"
                                            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                            type='password' />
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
                    <div className="m-6">
                        {users.map((user, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-orange-600 py-4">
                                <div className="flex items-center">
                                    <div className="mask mask-squircle bg-orange-600 h-10 w-10 flex items-center justify-center text-white">
                                        {user.user.charAt(0)}
                                    </div>
                                    <div className="ml-2">
                                        <p className="font-bold">Usuario: {user.user}</p>
                                        <p>Contraseña: {user.password}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="tooltip tooltip-warning" data-tip="Editar">
                                        <label
                                            htmlFor={`update${user._id}`}
                                            className="btn btn-ghost hover:border-yellow-400 active:border-yellow-600">
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </label>
                                    </div>
                                    <div className="tooltip tooltip-error" data-tip="Eliminar">
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="btn btn-ghost hover:border-red-400 active:border-red-600">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                {/* Update */}
                                <input type="checkbox" id={`update${user._id}`} className="modal-toggle" />
                                <div className="modal">
                                    <div className="modal-box relative">
                                        <label
                                            htmlFor={`update${user._id}`}
                                            className="btn btn-ghost btn-circle hover:border-red-400 active:border-red-600 absolute right-2 top-2">
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
                </div>
            )}
        </>
    )
};

export default Users;