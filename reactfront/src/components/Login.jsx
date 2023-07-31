import React, { useState } from 'react';
import axios from 'axios';
import office from '../assets/office.png';
import moon from '../assets/moonremovebg.png';

const URI = 'http://localhost:8000/login';

const Login = () => {

    const [selectedLogin, setSelectedLogin] = useState({
        user: '',
        password: ''
    })

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const errorMessageRequired = (
        <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error! Completa los Campos Requeridos.</span>
        </div>
    );

    const errorMessageCompletedEvaluations = (
        <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Has completado todas tus evaluaciones.</span>
        </div>
    );

    const errorMessageServerError = (
        <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Oops! A ocurrido un error, intentalo más tarde.</span>
        </div>
    );

    const errorMessageInvalidCredentials = (
        <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Verifica tu Usuario y/o Contraseña.</span>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!selectedLogin.user || !selectedLogin.password) {
                setShowError(true);
                setErrorMessage(errorMessageRequired);
                return;
            }
            const response = await axios.post(URI, {
                user: selectedLogin.user,
                password: selectedLogin.password
            });

            const { role, token } = response.data;

            localStorage.setItem('token', token);

            if (role === 'administrador') {
                window.location.href = '/home';
            } else if (role === 'estudiante') {
                try {
                    const accessResponse = await axios.get(`${URI}/student-info`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (accessResponse.status === 200 && accessResponse.data.message === 'Acceso permitido') {
                        window.location.href = '/student';
                    } else {
                        setShowError(true);
                        setErrorMessage(errorMessageCompletedEvaluations);
                        return;
                    }
                } catch (error) {
                    setShowError(true);
                    if (error.response && error.response.status === 403) {
                        setErrorMessage(errorMessageCompletedEvaluations);
                    } else {
                        setErrorMessage(errorMessageServerError);
                    }
                    return;
                }
            } else if (role === 'docente') {
                window.location.href = '/teacher';
            }
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = '/';
            }, 3600000);
        } catch (error) {
            setShowError(true);
            if (error.response && error.response.status === 401) {
                setErrorMessage(errorMessageInvalidCredentials);
            } else {
                setErrorMessage(errorMessageServerError);
            }
            return;
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="m-8 text-center lg:text-left">

                    <h1 className="text-5xl font-bold">¡Descubre nuestro innovador sistema de evaluación docente y mejora la calidad educativa!</h1>
                    <br />
                    <div className="lg:flex lg:items-center">
                        <p className="py-12 lg:w-3/4 lg:pr-16">
                            Nuestro sistema de evaluación docente no solo te permite gestionar y analizar los resultados de forma eficiente, sino que también brinda a los alumnos la oportunidad de participar y compartir su retroalimentación a través de un formulario interactivo.
                        </p>
                        <div className="flex">
                            <h1 className="text-9xl font-bold flex items-center">
                                F
                            </h1>
                            <img src={moon} alt="moon" className="w-2/3 lg:w-1/2 lg:h-auto" />
                            <h1 className="text-9xl font-bold flex items-center">
                                rm
                            </h1>
                        </div>
                    </div>
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
                                    className="my-4 input input-bordered"
                                    id="password"
                                    value={selectedLogin.password}
                                    onChange={(e) => setSelectedLogin({ ...selectedLogin, password: e.target.value })} />
                                {showError ? errorMessage : null}
                                <button className="my-4 btn btn-ghost bg-orange-600 text-white hover:bg-orange-400" type="submit">
                                    Entrar
                                </button>
                                <div className="divider">Ó</div>
                                <button type="button" className="my-4 w-full block rounded-lg px-4 py-3 border border-orange-600">
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