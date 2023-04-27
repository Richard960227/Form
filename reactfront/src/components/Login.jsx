import React, { useState } from 'react';
import axios from 'axios';
import office from '../assets/office.png';


const Login = () => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post('http://localhost:8000/login', {
                user: user,
                password: password // Enviar la contraseña sin encriptar
            });

            // Si la respuesta es exitosa, guarda el token en localStorage
            localStorage.setItem('token', response.data.token);

            // Redirige al usuario a la página de inicio
            window.location.href = '/home';
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="hero min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Usuario</span>
                                </label>
                                <input type="text" placeholder="Usuario" className="input input-bordered" id="user" value={user} onChange={(e) => setUser(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Contraseña</span>
                                </label>
                                <input type="password" placeholder="Contraseña" className="input input-bordered" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-400" type="submit">Entrar</button>
                            </div>
                            <div className="divider">Ó</div>
                            <div className="form-control mt-6">
                                <button type="button" className="w-full block rounded-lg px-4 py-3 border border-orange-600">
                                    <div className="flex items-center justify-center">
                                        <img src={office} className="w-10 h-10" />
                                        <span className="ml-4">
                                            Entrar con Office 365</span>
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login