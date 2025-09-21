import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import Layout from "./layout/layout.jsx";
import Signup from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import { currentUser } from './store/Slices/authSlice.js'
import BookRoom from './components/BookRoom.jsx'
import MyBookings from './components/MyBookings.jsx'
import Profile from './components/Profile.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import EditRoom from './components/EditRoom.jsx'
import { Toaster } from 'react-hot-toast'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: { borderRadius: "0", color: "red" },
          },
          success: {
            style: { borderRadius: "0", color: "green" },
          },
          duration: 2000,
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path=''
            element={<HomePage />}
          />
          <Route
            path='/room/:roomId'
            element={
              <AuthLayout>
                <BookRoom />
              </AuthLayout>
            }
          />
          <Route
            path='/my-bookings'
            element={
              <AuthLayout>
                <MyBookings />
              </AuthLayout>
            }
          />
          <Route
            path='/profile'
            element={
              <AuthLayout>
                <Profile />
              </AuthLayout>
            }
          />
          <Route
            path='/admin-panel'
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path='/edit-room/:roomId'
            element={
              <AdminRoute>
                <EditRoom />
              </AdminRoute>
            }
          />
        </Route>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
