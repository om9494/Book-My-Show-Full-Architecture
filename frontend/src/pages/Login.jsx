import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [submit, setSubmit] = useState("Login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateForm = () => {
    if (!username || !password) {
      alert("Username and password are required");
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("error").innerText = "";
    if (submit === "Logging In...") return;
    setSubmit("Logging In...");
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/signup/login`,
        {
          username,
          password
        }
      );
      if (response.status === 200) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("token", response.data.token);
        const roleresponse = await axios.get(`${import.meta.env.VITE_BACKEND_API}/signup/profile`, {
          headers: {
            'Authorization': `Bearer ${response.data.token}`,
          },
        });
        localStorage.setItem("role", roleresponse.data.roles[0]);
        document.getElementById("error").innerText = "Login successful! Redirecting...";
        // alert(`Logged in as ${username}`);
        window.location.href = "/";
      } else {
        document.getElementById("error").innerText = response.data || "Error logging in";
      }
    } catch (error) {
      document.getElementById("error").innerText = "Error logging in";
    } finally {
      setSubmit("Login");
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-h-[100vh] relative">
        {/* Split screen left panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-pink-400 via-red-300 to-yellow-200 relative overflow-hidden rounded-r-3xl shadow-2xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-bounce"></div>
          </div>
          <div className="relative z-10 text-center px-10">
            <h2 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">Welcome Back!</h2>
            <p className="text-lg text-white/80 font-medium mb-8">Book your next show with style.<br/>Enjoy exclusive offers and seamless booking.</p>
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
        {/* Right panel: Login form */}
        <div className="flex-1 flex items-center justify-center relative py-12 px-4">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
          </div>
          <div className="relative z-10 w-full max-w-md">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/30 flex flex-col gap-8 transform hover:scale-[1.03] transition-all duration-300">
              {/* Header with icon */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">Sign In</h2>
                <p className="text-gray-600 text-sm">Access your account</p>
              </div>
              <div className="space-y-6">
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
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
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
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    className="text-pink-600 hover:underline text-sm font-semibold"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-pink-600 hover:to-red-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">{submit}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              {/* Error message */}
              <p id="error" className="text-red-500 text-center mt-2 text-sm font-medium"></p>
              {/* Sign up link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account? 
                  <a href="/signup" className="text-pink-600 hover:text-pink-700 font-semibold ml-1 hover:underline transition-colors duration-200">
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login; 