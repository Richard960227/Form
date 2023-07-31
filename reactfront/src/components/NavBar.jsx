import React from 'react'
import moon from '../assets/moonremovebg.png';
import logo from '../assets/logo.png';

const NavBar = () => {
    return (
        <div className="navbar bg-base-100 border-b-2 border-orange-600 justify-between">
            <img src={moon} className="m-2 w-10 h-10" alt="Moon" />
            <p className="text-3xl ml-3 font-semibold">Sistema de Evaluación Docente</p>
            <img src={logo} className="m-2 w-12 h-12" alt="Moon" />
        </div>
    )
}

export default NavBar;