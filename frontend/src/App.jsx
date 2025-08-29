import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom' 
import Navbar from './components/Navbar'
import { useDispatch } from 'react-redux'
import HomePage from './pages/HomePage'
import Layout from "./layout/layout.jsx";
import Signup from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import { currentUser } from './store/Slices/authSlice.js'
import BookRoom from './components/BookRoom.jsx'
import MyBookings from './components/MyBookings.jsx'
import Profile from './components/Profile.jsx'
import AdminPanel from './components/AdminPanel.jsx'

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
          <Route
            path='/room/:roomId'
            element={<BookRoom />}
          />
          <Route
            path='/my-bookings'
            element={<MyBookings />}
          />
          <Route
            path='/profile'
            element={<Profile />}
          />
          <Route
            path='/admin-panel'
            element={<AdminPanel />}
          />
        </Route>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
