import React from 'react'
import { useState } from 'react';
import Slidebar from './Slidebar';
import Footer from './Footer'


const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Función que finaliza la carga después de 3 segundos
    setTimeout(() => {
        setIsLoading(false);
    }, 3000);

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="btn btn-square loading"></div>
                </div>
            ) : (
                <>
                    <Slidebar />
                    <Footer />
                </>
            )}
        </>
    )
}

export default Home