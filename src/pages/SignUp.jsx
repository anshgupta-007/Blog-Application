import React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSignUpData } from '../slices/authSlice';
import { User, Mail, Lock, Check, ArrowRight } from 'lucide-react';
import axios from 'axios';

const SignUp = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();
    if(!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if(!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if(password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if(password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    console.log(VITE_API_URL);
    setLoading(true);
    const response = await axios.post(VITE_API_URL + "/users/send-otp", {
        email
    })
    if(response.status === 200) {
        dispatch(setSignUpData({ name, email, password }));
        console.log("OTP sent Successfully");
        navigate("/send-otp");
    } else {
        setError("Internal Server Error");
    }
    setLoading(false);
  }
  if(loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
            <User className="mx-auto h-12 w-12 text-white" />
            <h2 className="mt-4 text-3xl font-extrabold text-white">
              Sign <span className="text-blue-100">Up</span>
            </h2>
            <p className="mt-2 text-sm text-blue-100">
              Sign Up to continue
            </p>
          </div>
          
          {/* Form area */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  Enter Name:
                </label>
                <input 
                  type="text" 
                  placeholder="Enter Name" 
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border border-gray-300 rounded-lg"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  Enter Email:
                </label>
                <input 
                  type="email" 
                  placeholder="Enter Email" 
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border border-gray-300 rounded-lg"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Lock className="h-4 w-4 text-gray-500 mr-2" />
                  Enter Password:
                </label>
                <input 
                  type="password" 
                  placeholder="Enter Password" 
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border border-gray-300 rounded-lg"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Check className="h-4 w-4 text-gray-500 mr-2" />
                  Enter Confirm Password:
                </label>
                <input 
                  type="password" 
                  placeholder="Enter Confirm Password" 
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border border-gray-300 rounded-lg"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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

              <div className="flex justify-center">
                <button 
                  className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 min-w-24"
                  onClick={sendOTP}
                >
                  <span className="flex items-center">
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="/login"
                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Login to existing account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} . All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default SignUp