import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { ServerUrl } from "../App";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ForgetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const handleSendOtp = async () => {
    try {
      const res = await axios.post(
        ServerUrl + "/api/auth/send-otp",
        { email },
        { withCredentials: true }
      );

      setStep(2);
    } catch (error) {
      console.log(error);
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(
        ServerUrl + "/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );

      setStep(3);
    } catch (error) {
      console.log(error);
    }
  };
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) return null;
    try {
      const res = await axios.post(
        ServerUrl + "/api/auth/reset-password",
        { email, newPassword },
        { withCredentials: true }
      );

      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-4 w-full bg-[#fff9f4]">
      <div className="bg-white rounded-xl shadow-lag w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/signin">
            <IoMdArrowBack size={20} className="text-[#ff4d2d]" />
          </Link>

          <h1 className="text-[#ff4d2d] font-bold  text-center">
            Forgot-password
          </h1>
        </div>
        {step == 1 && (
          <div>
            <div className="mb-6 ">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 
             focus:outline-none focus:border-orange-500"
                placeholder="Enter your email Id"
              />
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 text-white border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>
        )}
        {step == 2 && (
          <div>
            <div className="mb-4 ">
              <label className="block text-gray-700 font-medium mb-1">
                Enter OTP
              </label>
              <input
                type="email"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 
             focus:outline-none focus:border-orange-500"
                placeholder="Enter your OTP"
              />
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 text-white border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        )}
        {step == 3 && (
          <div>
            <div className="mb-4 ">
              <label className="block text-gray-700 font-medium mb-1">
                New password
              </label>
              <input
                type="email"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 
             focus:outline-none focus:border-orange-500"
                placeholder="Enter new password"
              />
              <div className="mt-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Confirm password
                </label>
                <input
                  type="email"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  className="w-full border border-[#ddd] rounded-lg px-3 py-2 
             focus:outline-none focus:border-orange-500"
                  placeholder="confirm password "
                />
              </div>
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 text-white border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer"
              onClick={handleResetPassword}
            >
              Reset password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
