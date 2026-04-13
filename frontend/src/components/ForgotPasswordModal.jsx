import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetState = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setPassword("");
    setRepeatPassword("");
    setLoading(false);
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Step 1: Send OTP to email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/forgetpassword/verifyemail/${email}`);
      setSuccess("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/forgetpassword/verifyOTP/${otp}/${email}`);
      setSuccess("OTP verified. Please enter your new password.");
      setStep(3);
    } catch (err) {
      setError(err?.response?.data || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password || !repeatPassword) {
      setError("Please fill both password fields.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/forgetpassword/changePassword/${email}`,
        { password, repeatpassword: repeatPassword }
      );
      setSuccess("Password changed successfully! Redirecting to login...");
      setTimeout(() => {
        handleClose();
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError(err?.response?.data || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl font-bold"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
          Forgot Password
        </h2>
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="flex flex-col gap-5">
            <label className="font-semibold text-gray-700">Enter your email</label>
            <input
              type="email"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white/60 backdrop-blur-md shadow-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Email"
              autoFocus
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            <label className="font-semibold text-gray-700">Enter OTP sent to your email</label>
            <input
              type="text"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white/60 backdrop-blur-md shadow-sm"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              placeholder="OTP"
              autoFocus
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            <label className="font-semibold text-gray-700">Enter new password</label>
            <input
              type="password"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white/60 backdrop-blur-md shadow-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="New password"
              autoFocus
            />
            <input
              type="password"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white/60 backdrop-blur-md shadow-sm"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              required
              placeholder="Re-enter password"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
        {(error || success) && (
          <div className={`mt-4 text-center text-sm font-semibold ${error ? "text-red-500" : "text-green-600"}`}>
            {error || success}
          </div>
        )}
        {step > 1 && step < 3 && (
          <button
            className="mt-4 text-pink-500 hover:underline text-sm"
            onClick={() => setStep(step - 1)}
            disabled={loading}
          >
            &larr; Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal; 