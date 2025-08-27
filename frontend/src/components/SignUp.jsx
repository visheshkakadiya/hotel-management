import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Phone, MapPin, Upload, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../store/Slices/authSlice.js";

function Signup() {
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const response = await dispatch(registerUser(data));
    if (response?.payload?.success) {
      const email = data?.email;
      const password = data?.password;
      const loginResult = await dispatch(loginUser({ email, password }));

      if (loginResult?.type === "login/fulfilled") {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-20 -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-300 to-amber-300 rounded-full opacity-20 translate-y-10 -translate-x-10"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <User className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start your journey today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-orange-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg"
                >
                  <Upload className="w-5 h-5 text-white" />
                </label>
              </div>
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                {...register("profilePic", { required: "Profile picture is required" })}
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500">Click the camera icon to upload your photo</p>
              {errors.profilePic && (
                <p className="text-red-500 text-sm mt-1">{errors.profilePic.message}</p>
              )}
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("fullName", { required: "Full name is required" })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  <Lock className="inline w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors pr-12"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <Phone className="inline w-4 h-4 mr-2" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  {...register("contact", { 
                    required: "Contact number is required",
                    pattern: {
                      value: /^[+]?[\d\s-()]+$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="+91 9876543210"
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Address
                </label>
                <textarea
                  {...register("address", { required: "Address is required" })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  placeholder="123 Street, City, Country"
                  rows="3"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
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
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-orange-600 hover:text-orange-800 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;