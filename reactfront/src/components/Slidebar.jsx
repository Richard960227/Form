import React, { useState, useEffect } from 'react'
import Hero from './Hero';
import Users from './Users';
import Teachers from './Teachers';
import Students from './Students';
import Create from './Create';
import Share from './Share';

const Slidebar = () => {
    const [userInteracted, setUserInteracted] = useState(false);

    const handleCheckboxChange = (event) => {
        if (!userInteracted) {
            return;
        }

        const htmlElement = document.querySelector('html');
        if (event.target.checked) {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
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

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const [selectedOption, setSelectedOption] = useState('Hero');

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
            case 'Share':
                return <Share />
            case 'Teachers':
                return <Teachers />;
            case 'Students':
                return <Students />;
            case 'Settings':
                return <Users />;
            default: return <Hero />
        }
    }

    return (
        <>
            <div className="drawer drawer-mobile">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer-2" className="btn btn-ghost hover:border-orange-500 hover:bg-white active:border-orange-600 active:bg-white m-2 lg:hidden "><i className="fa-solid fa-bars fa-xl"></i></label>
                    {renderSelectedOption()}
                </div>
                <div className="drawer-side border-r-2 border-orange-600">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                        <li className="bg-orange-600"></li>
                        <button onClick={() => handleOptionClick('Hero')} className="m-2"><i className="fa-solid fa-house fa-xl"></i></button>
                        <li className="bg-orange-600"></li>

                        <li className="m-2">
                            <button onClick={() => handleOptionClick('Create')} className="hover:bg-orange-400 hover:text-white active:bg-orange-600">Crear</button>
                        </li>
                        <li className="m-2">
                            <button onClick={() => handleOptionClick('Share')} className="hover:bg-orange-400 hover:text-white active:bg-orange-600">Compartir</button>
                        </li>
                        <li className="m-2">
                            <button onClick={() => handleOptionClick('Teachers')} className="hover:bg-orange-400 hover:text-white active:bg-orange-600">Docentes</button>
                        </li>
                        <li className="m-2">
                            <button onClick={() => handleOptionClick('Students')} className="hover:bg-orange-400 hover:text-white active:bg-orange-600">Estudiantes</button>
                        </li>
                        <li className="bg-orange-600"></li>
                        <div className="flex justify-end">
                                <label className="swap swap-rotate m-2">

                                    <input type="checkbox" onChange={handleCheckboxChange} />
                                    <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                                    <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                                </label>

                            <button id="exit" className="m-2" onClick={() => handleOptionClick('Settings')}>
                                <i className="fa-solid fa-gear fa-xl"></i>
                            </button>
                            <button id="exit" className="m-2 fa-xl" onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                        </div>
                    </ul>

                </div>
            </div>

        </>
    )
}


export default Slidebar