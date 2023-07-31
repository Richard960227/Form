import axios from 'axios';
import React, { useState, useEffect } from 'react'
import Logo from '../assets/moonremovebg.png';
import Hero from './Hero';
import Users from './Users';
import Teachers from './Teachers';
import Students from './Students';
import Create from './Create';


const URIUSER = 'http://localhost:8000/home/users';

const Slidebar = () => {
    const [initials, setInitials] = useState(null);
    const [userInteracted, setUserInteracted] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const handleCheckboxChange = (event) => {
        if (!userInteracted) {
            return;
        }

        const htmlElement = document.querySelector('html');

        if (event.target.checked) {
            htmlElement.setAttribute('data-theme', 'dark');
            setDarkModeEnabled(true);
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            setDarkModeEnabled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('change', () => {
            setUserInteracted(true);
        });
        return () => {
            window.removeEventListener('change', () => {
                setUserInteracted(true);
            });
        }
    }, []);

    useEffect(() => {
        // Función para obtener la información del usuario después del inicio de sesión
        async function fetchUserData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URIUSER}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const { name } = response.data;

                const nameArray = name.split(' '); // Dividir el nombre en un array de palabras
                const initials = nameArray.map((word) => word.charAt(0)).join(''); // Obtener la primera letra de cada palabra y unirlas
                setInitials(initials);
            } catch (error) {
                console.error(error);
            }
        }
    
        fetchUserData();
    }, []);    

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const [selectedOption, setSelectedOption] = useState('Create');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const renderSelectedOption = () => {
        switch (selectedOption) {
            case 'Hero':
                return <Hero />;
            case 'Create':
                return <Create />;
            case 'Teachers':
                return <Teachers />;
            case 'Students':
                return <Students />;
            case 'Settings':
                return <Users />;
            default: return <Hero />
        }
    }

    const buttonStyle = {
        filter: (darkModeEnabled) ? 'invert(100%)' : 'none',
    };

    return (
        <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <div className="w-full navbar bg-base-100">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-3" className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                            <i className="fa-solid fa-bars fa-xl"></i>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2">
                        <p className="text-3xl font-semibold">Evaluación Docente</p>
                    </div>
                    <div className="flex-none hidden lg:block">
                        <div className="menu menu-horizontal">
                            <button
                                onClick={() => handleOptionClick('Create')}
                                className={`mr-3 ${darkModeEnabled ? 'dark' : ''}`}
                            >
                                <img src={Logo} alt="" className="w-10 h-10" style={buttonStyle} />
                            </button>
                            <button
                                onClick={() => handleOptionClick('Hero')}
                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-chart-line fa-xl"></i>
                            </button>
                            <button
                                onClick={() => handleOptionClick('Teachers')}
                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-chalkboard-user fa-lg"></i>
                            </button>
                            <button
                                onClick={() => handleOptionClick('Students')}
                                className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white">
                                <i className="fa-solid fa-graduation-cap fa-lg"></i>
                            </button>
                            <div className="dropdown dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="mr-2 btn btn-ghost mask mask-squircle text-lg font-semibold hover:bg-orange-600 hover:text-white">
                                    {initials}
                                </label>
                                <div tabIndex={0} className="p-2 mt-4 shadow-xl menu menu-compact dropdown-content z-[1] bg-base-100 w-52 rounded-lg">
                                    <div className="flex justify-between items-center ">
                                        Configuración
                                        <button
                                            className="btn btn-ghost swap swap-rotate mask mask-squircle  justify-end  hover:bg-orange-600 hover:text-white"
                                            onClick={() => handleOptionClick('Settings')}>
                                            <i className="fa-solid fa-gear fa-lg"></i>
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        Modo Oscuro
                                        <label className="btn btn-ghost swap swap-rotate mask mask-squircle  justify-end  hover:bg-orange-600 hover:text-white">
                                            <input
                                                type="checkbox"
                                                checked={darkModeEnabled}
                                                onChange={handleCheckboxChange}
                                                disabled={!userInteracted} />
                                            <svg
                                                className="swap-on fill-current w-6 h-6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24">
                                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                                            </svg>
                                            <svg
                                                className="swap-off fill-current w-6 h-6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                                            </svg>
                                        </label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        Salir
                                        <button id="exit" className="btn btn-ghost mask mask-squircle justify-end  hover:bg-orange-600 hover:text-white" onClick={handleLogout}>
                                            <i className="fa-solid fa-right-from-bracket fa-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {renderSelectedOption()}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 h-full bg-base-100">
                    <button
                        onClick={() => handleOptionClick('Create')}
                        className={`flex justify-center items-center ${darkModeEnabled ? 'dark' : ''}`}
                    >
                        <img src={Logo} alt="" className="w-14 h-14" style={buttonStyle} />
                    </button>
                    <div className="divider"></div>
                    <button
                        onClick={() => handleOptionClick('Hero')}
                        className="m-2 btn btn-ghost hover:bg-orange-600 hover:text-white flex justify-between items-center">
                        <p>Dashboard</p>
                        <i className="fa-solid fa-chart-line fa-xl"></i>
                    </button>
                    <button
                        onClick={() => handleOptionClick('Teachers')}
                        className="m-2 btn btn-ghost hover:bg-orange-600 hover:text-white flex justify-between items-center">
                        <p>Docentes</p>
                        <i className="fa-solid fa-chalkboard-user fa-lg"></i>
                    </button>
                    <button
                        onClick={() => handleOptionClick('Students')}
                        className="m-2 btn btn-ghost hover:bg-orange-600 hover:text-white flex justify-between items-center">
                        <p>Estudiantes</p>
                        <i className="fa-solid fa-graduation-cap fa-lg"></i>
                    </button>
                    <div className="divider"></div>
                    <div className="m-2 flex justify-end">
                        <button
                            className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                            onClick={() => handleOptionClick('Settings')}>
                            <i className="fa-solid fa-gear fa-lg"></i>
                        </button>
                        <label className="btn btn-ghost swap swap-rotate mask mask-squircle hover:bg-orange-600 hover:text-white">

                            <input
                                type="checkbox"
                                checked={darkModeEnabled}
                                onChange={handleCheckboxChange}
                                disabled={!userInteracted} />
                            <svg
                                className="swap-on fill-current w-7 h-7"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                            <svg
                                className="swap-off fill-current w-7 h-7"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                        </label>
                        <button
                            id="exit"
                            className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                            onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Slidebar