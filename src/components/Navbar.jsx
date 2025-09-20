import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Logo from "../../public/images/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { User, LogOut } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  // Handle scroll event to change navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  const navItems = [
    { label: "HOME", path: "/" },
    { label: "SERVICES", path: "/services" },
    { label: "PRICING", path: "/payment" },
    { label: "CONTACT US", path: "/contact" },
    { label: "ABOUT", path: "/about" },
  ];

  // Function to split text into individual letters with shared animation
  const splitText = (text) => {
    return text.split('').map((letter, index) => (
      <span
        key={index}
        className="letter inline-block transition-all duration-400 ease-out transform"
        style={{
          transitionDelay: `${index * 0.05}s`,
          color: isHovered ? '#8316EF' : 'white',
          transform: isHovered 
            ? 'rotateY(360deg) scale(1.2) skewX(15deg)' 
            : 'rotateY(0deg) scale(1) skewX(0deg)',
        }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-purple-900/20 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with text */}
          <div 
            className="flex items-center ml-2 sm:ml-4 md:ml-6 pt-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img src={Logo} alt="Pixellift Logo" className="h-5 sm:h-6 w-auto mr-2" />
            <span className="font-bold text-base sm:text-lg flex items-center">
              {splitText('PIXELLIFT')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 pt-1">
            <ul className="flex space-x-6 lg:space-x-8">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`font-medium transition-colors ${
                      isScrolled
                        ? "text-white hover:text-purple-200"
                        : "text-white hover:text-blue-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Profile / Login Button (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button 
                  className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{user.name || 'My Account'}</span>
                </button>
                
                {showDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/payment"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Upgrade Plan
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="font-bold py-2 px-4 uppercase tracking-wide transform -skew-x-12 transition-all duration-300 hover:scale-105 border-2 border-white text-white text-sm hover:bg-white/10"
              >
                <span className="inline-block">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Login/User Button */}
          <div className="md:hidden">
            {user ? (
              <div className="relative">
                <button 
                  className="text-white hover:text-blue-200 text-sm font-medium flex items-center gap-1"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/payment"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Upgrade Plan
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-white hover:text-blue-200 text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden mt-2 pb-4 rounded-lg ${
              isScrolled ? "bg-purple-900/30 backdrop-blur-md" : "bg-black/80"
            }`}
          >
            <ul className="flex flex-col space-y-3 px-4 sm:px-6">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="block py-3 font-medium text-sm sm:text-base text-white"
                    onClick={() => setMobileMenuOpen(false)} // ✅ closes menu after click
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/auth"
                  className="block py-3 font-medium text-sm sm:text-base text-white border-2 border-white text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;