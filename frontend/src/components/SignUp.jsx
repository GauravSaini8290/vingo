import React, { useEffect, useState } from "react";
import { ServerUrl } from "../App";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
const SignUp = () => {
  const primarycolor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f4";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("gaurav saini");
  const [email, setEmail] = useState("gaurav@1234gmail.com");
  const [password, setPassword] = useState("12345678");
  const [mobile, setMobile] = useState("8745670978");
  const [role, setRole] = useState("user");
  const[err ,setErr] = useState("")
console.log(err)
  const signUpApi = async () => {
    try {
      const res = await axios.post(
        ServerUrl + "/api/auth/signUp",
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      setErr("")
    } catch (error) {
        const msg =
    error?.response?.data?.message || "Something went wrong";
  setErr(msg);
      console.log(error.message);
    }
  };
  
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center "
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]"
        style={{ borderColor: borderColor }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primarycolor }}>
          Vingo
        </h1>
        <p className="text-gray-600 mb-8">
          create your account to get started with delicious food deliveries
        </p>

        {/* fullName */}

        <div className="mb-4 ">
          <label className="block text-gray-700 font-medium mb-1">
            FullName
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 
             focus:outline-none focus:border-orange-500"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4 ">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
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
        <div className="mb-4 ">
          <label className="block text-gray-700 font-medium mb-1">Mobile</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
            }}
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 
             focus:outline-none focus:border-orange-500"
            placeholder="Enter your mobile number"
          />
        </div>
        <div className="mb-4 ">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 
             focus:outline-none focus:border-orange-500"
              placeholder="Enter your password"
            />
            <button
              className="absolute right-3 text-gray-500 top-[13px] cursor-pointer"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>
        <p className="text-red-500 text-right">{err}</p>
        <div className="mb-4 ">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r,index) => (
              <button key={index}
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer "
                onClick={() => {
                  setRole(r);
                }}
                style={
                  role == r
                    ? { backgroundColor: primarycolor, color: "white" }
                    : { border: `1px solid ${primarycolor}`, color: "#333" }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-2 text-white border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer" onClick={signUpApi}>
          sign Up
        </button>
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 bg-gray-300 hover:bg-gray-200 cursor-pointer">
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>
        <p className="text-center mt-2 cursor-pointer">
          Already have an account ?{" "}
          <Link to="/signin">
            <span className="text-[#ff4d2d]"> sign in </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
