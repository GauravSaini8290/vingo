import React, {  useState } from "react";
import { ServerUrl } from "../App";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
const SignIn = () => {
  const primarycolor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f4";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const[err ,setErr] = useState("")
console.log(err)
  const signInApi = async () => {
    try {
      const res = await axios.post(
        ServerUrl + "/api/auth/signIn",
        {  email, password },
        { withCredentials: true }
      );
      console.log(res)
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
       <Link to="/forgot-password">
       <p className="text-[#ff4d2d]">Forgot password </p>
       </Link> 
        <p className="text-red-500 text-right">{err}</p>
        
        <button className="w-full mt-4 flex items-center justify-center gap-2 text-white border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] hover:bg-[#e64323] cursor-pointer" onClick={signInApi}>
          sign In
        </button>
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 bg-gray-300 hover:bg-gray-200 cursor-pointer">
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>
        <p className="text-center mt-2 cursor-pointer">
          Create new account ?{" "}
          <Link to="/signup">
            <span className="text-[#ff4d2d]"> sign Up </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

