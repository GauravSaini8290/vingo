import React, { useState } from "react";
import { ServerUrl } from "../App";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const primarycolor = "#ff4d2d";
  const bgColor = "#fff9f4";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("8290580838");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const dispatch = useDispatch();

  // ================= SIGNUP API =================
  const signUpApi = async () => {
    if (!fullName || !email || !password || !mobile) {
      return setErr("All fields are required");
    }

    if (mobile.length !== 10) {
      return setErr("Enter valid 10 digit mobile number");
    }

    try {
      setLoading(true);
      setErr("");

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/signUp`,
        { fullName, email, password, mobile, role },
        { withCredentials: true },
      );
      console.log(data);

      dispatch(setUserData(data?.user));
    } catch (error) {
      setErr(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE AUTH =================
  const handleGoogle = async () => {
    if (!mobile) return setErr("Enter mobile number first");

    if (mobile.length !== 10) {
      return setErr("Enter valid 10 digit mobile number");
    }

    try {
      setErr("");
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/google-auth`,
        {
          fullName: res.user.displayName,
          email: res.user.email,
          mobile,
          role,
        },
        { withCredentials: true },
      );

      dispatch(setUserData(data?.user));
    } catch (error) {
      setErr(error?.response?.data?.message || "Google sign in failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border"
        style={{ borderColor }}
      >
        <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Vingo</h1>
        <p className="text-gray-600 mb-6">Create your account to get started</p>

        {/* FULL NAME */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your name"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter email"
          />
        </div>

        {/* MOBILE */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Mobile</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="10 digit mobile number"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter password"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {err && <p className="text-red-500 text-sm mb-2">{err}</p>}

        {/* ROLE */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Role</label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 border rounded-lg py-2 ${
                  role === r ? "bg-[#ff4d2d] text-white" : "border-[#ff4d2d]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* SIGNUP BUTTON */}
        <button
          onClick={signUpApi}
          disabled={loading}
          className="w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg flex justify-center"
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
        </button>

        {/* GOOGLE */}
        <button
          onClick={handleGoogle}
          className="w-full mt-4 border py-2 rounded-lg flex justify-center gap-2"
        >
          <FcGoogle size={20} /> Sign up with Google
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/signin" className="text-[#ff4d2d]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
