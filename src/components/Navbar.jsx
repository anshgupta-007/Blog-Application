import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeToken, removeUser } from '../slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const moveToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const logoutHandler = () => {
    dispatch(removeToken());
    dispatch(removeUser());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md text-gray-800" : "bg-gradient-to-r from-blue-600  to-indigo-700 text-white"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <button 
              className="font-bold text-xl flex items-center group" 
              onClick={moveToHome}
            >
              <svg 
                className={`w-8 h-8 mr-2 transition-transform duration-300 group-hover:rotate-12 ${
                  isScrolled ? "text-blue-600" : "text-blue-300"
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span className="font-serif tracking-wider">BlogHub</span>
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {token && (
              <Link 
                to="/createBlog" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-blue-100 hover:text-blue-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Write a Blog
              </Link>
            )}
            
            {token && (
              <Link 
                to="/viewDraft" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-blue-100 hover:text-blue-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Drafts
              </Link>
            )}
            
            {!token && (
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-blue-100 hover:text-blue-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </Link>
            )}
            
            {!token && (
              <Link 
                to="/signup" 
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  isScrolled 
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-blue-800 hover:bg-blue-50"
                }`}
              >
                Sign Up
              </Link>
            )}
            
            {token && (
              <button 
                onClick={logoutHandler}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-red-100 hover:text-red-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-60 opacity-100 py-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            {token && (
              <Link 
                to="/createBlog" 
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-blue-100 hover:text-blue-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Write a Blog
              </Link>
            )}
            
            {token && (
              <Link 
                to="/viewDraft" 
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-blue-100 hover:text-blue-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View Drafts
              </Link>
            )}
            
            {!token && (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-blue-100 hover:text-blue-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </Link>
            )}
            
            {!token && (
              <Link 
                to="/signup" 
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-center transition-all duration-200 ${
                  isScrolled 
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-blue-800 hover:bg-blue-50"
                }`}
              >
                Sign Up
              </Link>
            )}
            
            {token && (
              <button 
                onClick={logoutHandler}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  isScrolled 
                    ? "hover:bg-red-100 hover:text-red-600" 
                    : "hover:bg-white/10"
                }`}
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;