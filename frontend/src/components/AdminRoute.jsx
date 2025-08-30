import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from 'lucide-react';

function AdminRoute({ children }) {
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth?.loading);
    const status = useSelector((state) => state.auth.status);
    
    console.log("AdminRoute - user:", user);
    console.log("AdminRoute - loading:", loading);
    console.log("AdminRoute - status:", status);

    // Show loading while authentication is in progress
    if (loading || status === false) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin" size={32} />
            </div>
        );
    }

    return user?.role === "admin" ? children : <Navigate to="/" replace />;
}

export default AdminRoute;