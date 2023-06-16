import React, { useState } from 'react';
//importamos el router
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './components/Home';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';



function Landing() {

  const [isLoading, setIsLoading] = useState(true);

  // Función que finaliza la carga después de 5 segundos
  setTimeout(() => {
    setIsLoading(false);
  }, 5000);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="btn btn-square loading"></div>
        </div>
      ) : (
        <div className="font-sans font-normal text-base">
          <NavBar />
          <Login />
          <Footer />
        </div>
      )}
    </>
  );
}

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/home/' element={<Home />} />
          <Route path='/teacher/' element={<TeacherView />} />
          <Route path='/student/' element={<StudentView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App
