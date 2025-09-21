import React, { useState, useEffect } from "react";
import { User, LogOut, ChevronDown, Calendar, Shield } from "lucide-react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/Slices/authSlice.js";

function Navbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser());
      navigate("/login");
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const NavLink = ({ to, children, mobile = false }) => (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `${mobile
          ? "block font-medium py-2"
          : "py-2 border-b-2 transition-colors duration-200"
        } 
        ${isActive
          ? "text-orange-600 border-orange-600"
          : "text-gray-700 hover:text-orange-600 hover:border-orange-600"
        }`
      }
      onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined}
    >
      {children}
    </RouterNavLink>
  );

  const ProfileImage = ({ size = "w-10 h-10" }) => (
    <div className={`${size} rounded-full overflow-hidden border-2 border-orange-200`}>
      {user?.avatar?.url ? (
        <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-orange-200 flex items-center justify-center">
          <User className="w-6 h-6 text-orange-600" />
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          HotelEase
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {/* Book Room - plain link (no active state) */}
          <li>
            <a
              href="/"
              className="py-2 border-b-2 border-transparent text-gray-700 hover:text-orange-600 hover:border-orange-600 transition-colors duration-200"
            >
              Book Room
            </a>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/my-bookings">My Bookings</NavLink>
              </li>
              {user.role === "admin" && (
                <li>
                  <NavLink to="/admin-panel">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Admin Panel
                  </NavLink>
                </li>
              )}
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-orange-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative profile-dropdown">
              <button
                onClick={() =>
                  setIsProfileDropdownOpen(!isProfileDropdownOpen)
                }
                className="flex items-center space-x-3 bg-orange-50 hover:bg-orange-100 rounded-full p-2 transition-colors duration-200"
              >
                <ProfileImage />
                <span className="text-gray-700 font-medium hidden lg:block">
                  {user.fullName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  {[
                    { to: "/profile", icon: User, label: "View Profile" },
                    { to: "/my-bookings", icon: Calendar, label: "My Bookings" },
                  ].map(({ to, icon: Icon, label }) => (
                    <RouterNavLink
                      key={to}
                      to={to}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {label}
                    </RouterNavLink>
                  ))}

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
              <RouterNavLink
                to="/login"
                className="text-gray-700 hover:text-orange-600 font-medium py-2 px-4 rounded-lg hover:bg-orange-50 transition-all duration-200"
              >
                Login
              </RouterNavLink>
              <RouterNavLink
                to="/signup"
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign Up
              </RouterNavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <NavLink to="/" mobile>
              Home
            </NavLink>
            {/* Book Room - plain link (no active state) */}
            <a
              href="/"
              className="block font-medium py-2 text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Room
            </a>
            {user && (
              <>
                <NavLink to="/my-bookings" mobile>
                  My Bookings
                </NavLink>
                {user.role === "admin" && (
                  <NavLink to="/admin-panel" mobile>
                    <Shield className="inline w-4 h-4 mr-2" />
                    Admin Panel
                  </NavLink>
                )}
              </>
            )}

            <div className="pt-3 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <ProfileImage size="w-8 h-8" />
                    <span className="text-gray-700 font-medium">
                      {user.fullName}
                    </span>
                  </div>
                  <NavLink to="/profile" mobile>
                    Profile
                  </NavLink>
                  <NavLink to="/settings" mobile>
                    Settings
                  </NavLink>
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
                  <NavLink to="/login" mobile>
                    Login
                  </NavLink>
                  <RouterNavLink
                    to="/signup"
                    className="block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
                  >
                    Sign Up
                  </RouterNavLink>
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
