import React from 'react'
import logo from '../assets/logo.png'

const NavBar = () => {
    return (
        <div className="navbar bg-base-100 drawer-side border-b-2 border-orange-600">
            <div className="flex-none">
                <img src={logo} className="w-12 h-12" alt="UTC"/>
            </div>
            <div className="flex-1">
                <p className="text-3xl ml-3">Evaluación Docente</p>
            </div>
        </div>
    )
}

export default NavBar;