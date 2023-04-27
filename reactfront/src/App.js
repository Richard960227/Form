import React from 'react'
//importamos el router
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './components/Home';



function Landing() {
  return (
    <>
      <NavBar />
      <Login />
      <Footer />
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
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App
