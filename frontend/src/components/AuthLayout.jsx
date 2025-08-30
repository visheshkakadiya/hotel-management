import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, replace, useLocation, useNavigate } from "react-router-dom";

function AuthLayout({ children }) {
  
  const { user, loading, status} = useSelector((state) => state.auth);
  const location = useLocation();

  if(!status || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Login to continue
      </div>
    )
  }

  return status ? children : <Navigate to='/login' state={{from : location}} replace/>;
}

export default AuthLayout;
