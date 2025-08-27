import React, { useState } from "react";
import { User, LogOut, ChevronDown, Settings, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, currentUser } from "../store/Slices/authSlice.js";

function Navbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const curruser = useSelector((state) => state.auth.user);
  console.log("curruser", curruser);

  // Mock user data - replace with your actual useSelector
  const user = {
    fullName: "John Doe",
    email: "john@example.com",
    avatar: null, // Set to an image URL to test avatar
    role: "admin" // Change to "user" to test non-admin view
  };

  // Mock functions - replace with your actual dispatch calls
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // await dispatch(logoutUser());
      // navigate("/");
      console.log("Logout clicked");
      setTimeout(() => {
        setIsLoggingOut(false);
        setIsProfileDropdownOpen(false);
        alert("Logged out successfully!");
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setIsProfileDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
          HotelEase
        </a>

        {/* Navigation Links - Desktop */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <a 
              href="/" 
              className="hover:text-orange-600 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-orange-600"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/book-room" 
              className="hover:text-orange-600 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-orange-600"
            >
              Book Room
            </a>
          </li>
          {user && (
            <>
              <li>
                <a 
                  href="/my-bookings" 
                  className="hover:text-orange-600 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-orange-600"
                >
                  My Bookings
                </a>
              </li>
              {user.role === 'admin' && (
                <li>
                  <a 
                    href="/admin-panel" 
                    className="hover:text-orange-600 transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-orange-600 flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin Panel
                  </a>
                </li>
              )}
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 hover:text-orange-600 transition-colors"
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Authentication Section - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative profile-dropdown">
              {/* Profile Button */}
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-3 bg-orange-50 hover:bg-orange-100 rounded-full p-2 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                  )}
                </div>
                <span className="text-gray-700 font-medium hidden lg:block">
                  {user.fullName || user.name || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      {user.fullName || user.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </a>
                    
                    <a
                      href="/my-bookings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Calendar className="w-4 h-4 mr-3" />
                      My Bookings
                    </a>
                    
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </a>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-3"></div>
                          Signing Out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <a
                href="/login"
                className="text-gray-700 hover:text-orange-600 font-medium py-2 px-4 rounded-lg hover:bg-orange-50 transition-all duration-200"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <a href="/" className="block text-gray-700 hover:text-orange-600 font-medium py-2">
              Home
            </a>
            <a href="/book-room" className="block text-gray-700 hover:text-orange-600 font-medium py-2">
              Book Room
            </a>
            {user && (
              <>
                <a href="/my-bookings" className="block text-gray-700 hover:text-orange-600 font-medium py-2">
                  My Bookings
                </a>
                {user.role === 'admin' && (
                  <a href="/admin-panel" className="block text-gray-700 hover:text-orange-600 font-medium py-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </a>
                )}
              </>
            )}
            
            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-200">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-orange-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">{user.fullName || user.name || 'User'}</span>
                  </div>
                  <a href="/profile" className="block text-gray-700 hover:text-orange-600 font-medium py-2">
                    View Profile
                  </a>
                  <a href="/settings" className="block text-gray-700 hover:text-orange-600 font-medium py-2">
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center text-red-600 font-medium py-2 disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        Signing Out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <a
                    href="/login"
                    className="block text-gray-700 hover:text-orange-600 font-medium py-2"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;