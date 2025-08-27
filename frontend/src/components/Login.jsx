import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser, currentUser } from "../store/Slices/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const login = await dispatch(loginUser(data));
      const user = await dispatch(currentUser());

      if (user && login?.payload) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-20 -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-300 to-amber-300 rounded-full opacity-20 translate-y-6 -translate-x-6"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors pl-10"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors pl-10 pr-12"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a 
                href="#" 
                className="text-sm text-orange-600 hover:text-orange-800 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="text-orange-600 hover:text-orange-800 font-semibold hover:underline transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;