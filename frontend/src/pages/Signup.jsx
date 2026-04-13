import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [ageStr, setAgeStr] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState("Sign Up");
  
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateAge = (age) => {
    const ageNum = parseInt(age, 10);
    return !isNaN(ageNum) && ageNum > 0;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(String(email).toLowerCase());
  };
  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/; // Simple validation for 10-digit phone numbers
    return re.test(phone);
  };
  const validateForm = () => {
    if (!username || !password || !name || !email || !gender || !ageStr || !phoneNumber) {
      alert("All fields are required");
      return false;
    }
    if (!validateAge(ageStr)) {
      alert("Please enter a valid age");
      return false;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("error").innerText = "";
    if (submit === "Signing Up...") return;
    setSubmit("Signing Up...");
    if (!validateForm()) return;
    if(password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try{
      const response = await axios.post(import.meta.env.VITE_BACKEND_API + "/signup/register", {
        username,
        password,
        name,
        gender,
        age: ageStr,
        phoneNumber,
        email
      });
      document.getElementById("error").innerText = response.data;
      if (response.status === 201) {
        alert("Account created successfully! Redirecting to login...");
        window.location.href = "/login";
      } else {
        document.getElementById("error").innerText = response.data || "Error creating account";
      }
    } catch (error) {
      document.getElementById("error").innerText = "Error creating account";
      return;
    }
    finally {
      setSubmit("Sign Up");
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-h-[80vh] relative">
        {/* Split screen left panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-yellow-300 via-pink-400 to-red-400 relative overflow-hidden rounded-r-3xl shadow-2xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-bounce"></div>
          </div>
          <div className="relative z-10 text-center px-10">
            <h2 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">Join the Show!</h2>
            <p className="text-lg text-white/80 font-medium mb-8">Create your account and unlock a world of entertainment.<br/>Fast, secure, and rewarding.</p>
            <div className="flex justify-center">
              <svg className="w-32 h-32 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <rect x="8" y="16" width="32" height="20" rx="6" fill="currentColor" opacity="0.1"/>
                <rect x="8" y="16" width="32" height="20" rx="6" strokeWidth="2"/>
                <circle cx="24" cy="26" r="4" strokeWidth="2"/>
                <path d="M16 36v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>
        {/* Right panel: Signup form */}
        <div className="flex-1 flex items-center justify-center relative py-12 px-4">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-10 blur-3xl"></div>
          </div>
          <div className="relative z-10 w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/30 flex flex-col gap-8 transform hover:scale-[1.03] transition-all duration-300">
              {/* Header with icon */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">Sign Up</h2>
                <p className="text-gray-600 text-sm">Create your account to get started</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm"
                      required
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
                {/* Name */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                {/* Phone Number */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm"
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                {/* Gender */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Gender</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm appearance-none"
                      required
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Age */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      value={ageStr}
                      onChange={(e) => setAgeStr(e.target.value.toString())}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm"
                      required
                      placeholder="Enter your age"
                    />
                  </div>
                </div>
              </div>
              {/* Password fields in a separate row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm"
                      required
                      placeholder="Create a password"
                    />
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="relative group">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm"
                      required
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>
              <button 
                id="submit" 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-pink-600 hover:to-red-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">{submit}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              {/* Error message */}
              <p id="error" className="text-red-500 text-center mt-2 text-sm font-medium"></p>
              {/* Login link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account? 
                  <a href="/login" className="text-pink-600 hover:text-pink-700 font-semibold ml-1 hover:underline transition-colors duration-200">
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup; 