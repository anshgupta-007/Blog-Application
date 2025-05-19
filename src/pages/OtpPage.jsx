import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/authSlice";
import { setLoading } from "../slices/authSlice";
import axios from "axios";
import.meta.env.VITE_API_URL


const OtpPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signUpData = useSelector((state) => state.auth.signUpData);
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = pasted[i];
      }
    }
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter a valid OTP");
      return;
    }
    setError("");
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    console.log("SignUpData : ", signUpData);
    const response = await axios.post(VITE_API_URL + "/users/signup", {
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        otp: enteredOtp,
    });
    console.log(response);
    if (response.status === 200) {
      // dispatch(setToken(response.data.token));
      // dispatch(setUser(response.data.user));
      dispatch(setLoading(false));
      console.log("User Created Successfully");
      navigate("/login");
    }
    else {
      setError("Invalid OTP! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
        <p className="mb-4 text-sm text-gray-500">Please enter the 6-digit OTP sent to your phone</p>
        <div className="flex justify-between mb-4 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpPage;
