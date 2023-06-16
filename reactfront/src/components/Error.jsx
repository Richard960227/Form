import React from 'react'
import Error404 from '../assets/Error.jpeg'

const Error = () => {
    return (
        <div className="flex items-center justify-center h-screen overflow-hidden">
            <img src={Error404} alt="Error404"/>
        </div>
    )
}

export default Error