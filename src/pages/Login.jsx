import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../slices/authSlice';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if(!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }
        
        if(!email.includes("@")) {
            setError("Please enter a valid email");
            setIsLoading(false);
            return;
        }
        
        if(password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }
        
        setError("");
        
        try {
            const VITE_API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(VITE_API_URL + "/users/login", {
                email,
                password
            });
            
            if(response.status === 200) {
                dispatch(setToken(response.data.token));
                dispatch(setUser(response.data.user));
                navigate("/");
            } else if(response.status === 201) {   
                setError("Invalid email or password");
            } else {
                setError("Something went wrong");
            }
        } catch (err) {
            setError("Failed to connect. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
                        <LogIn className="mx-auto h-12 w-12 text-white" />
                        <h2 className="mt-4 text-3xl font-extrabold text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-blue-100">
                            Sign in to continue to your account
                        </p>
                    </div>
                    
                    {/* Form area */}
                    <div className="px-6 py-8">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                    Email Address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border border-gray-300 rounded-lg"
                                        placeholder="you@example.com"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                document.getElementById('password').focus();
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Lock className="h-4 w-4 text-gray-500 mr-2" />
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border border-gray-300 rounded-lg"
                                        placeholder="••••••••"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleLogin(e);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-3">
                                    <div className="flex">
                                        <div className="ml-2">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            Sign In
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Don't have an account?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="/signup"
                                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    Create a new account
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-4 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} BlogHub All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default Login;