import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom' 
import Navbar from './components/Navbar'
import { useDispatch } from 'react-redux'
import HomePage from './pages/HomePage'
import Layout from "./layout/layout.jsx";
import Signup from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import { currentUser } from './store/Slices/authSlice.js'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route 
            path=''
            element={<HomePage />}
          />
        </Route>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
