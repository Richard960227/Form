import React, { useState } from 'react';
import axios from 'axios';
import office from '../assets/office.png';

const URI = 'http://localhost:8000/login';

const Login = () => {

    const [selectedLogin, setSelectedLogin] = useState({
        user: '',
        password: ''
    })

    const [showError, setShowError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLogin.user || !selectedLogin.password) {
            setShowError(true);
            return;
        }
        try {
            const response = await axios.post(URI, {
                user: selectedLogin.user,
                password: selectedLogin.password
            });

            const { role, token } = response.data;

            localStorage.setItem('token', token);

            if (role === 'administrador') {
                window.location.href = '/home';
            } else if (role === 'estudiante') {
                window.location.href = '/student';
            } else {
                setShowError(false);
            }

            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = '/'; 
            }, 3600000);
        } catch (error) {
            setShowError(true);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <input
                                    type="text"
                                    placeholder="Usuario"
                                    className="input input-bordered"
                                    id="user"
                                    value={selectedLogin.user}
                                    onChange={(e) => setSelectedLogin({ ...selectedLogin, user: e.target.value })} />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    className="input input-bordered mt-6"
                                    id="password"
                                    value={selectedLogin.password}
                                    onChange={(e) => setSelectedLogin({ ...selectedLogin, password: e.target.value })} />
                            </div>
                            {showError ? (
                                <div className="alert alert-error shadow-lg mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Error! Completa los Campos Requeridos.</span>
                                </div>
                            ) : null}
                            <div className="form-control mt-6">
                                <button className="btn btn-ghost bg-orange-600 text-white hover:bg-orange-400" type="submit">
                                    Entrar
                                </button>
                            </div>
                            <div className="divider">Ó</div>
                            <div className="form-control mt-6">
                                <button type="button" className="w-full block rounded-lg px-4 py-3 border border-orange-600">
                                    <div className="flex items-center justify-center">
                                        <img src={office} className="w-10 h-10" alt="Office365" />
                                        <span className="ml-4">
                                            Entrar con Office 365
                                        </span>
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