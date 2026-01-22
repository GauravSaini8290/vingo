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

const SignIn = () => {
  const primarycolor = "#ff4d2d";
  const bgColor = "#fff9f4";
  const borderColor = "#ddd";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const dispatch = useDispatch();

  // ================= SIGNIN API =================
  const signInApi = async () => {
    if (!email || !password) {
      return setErr("Email and password are required");
    }

    try {
      setLoading(true);
      setErr("");

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/signIn`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(data?.user));
    } catch (error) {
      setErr(error?.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE AUTH =================
  const handleGoogle = async () => {
    try {
      setErr("");
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      if (!res?.user?.email) {
        return setErr("Google authentication failed");
      }

      const { data } = await axios.post(
        `${ServerUrl}/api/auth/google-auth`,
        { email: res.user.email },
        { withCredentials: true }
      );

      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
      setErr(error?.response?.data?.message || "Google sign-in failed");
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
        <p className="text-gray-600 mb-6">
          Sign in to get started with delicious food deliveries
        </p>

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

        {/* FORGOT PASSWORD */}
        <Link to="/forgot-password">
          <p className="text-[#ff4d2d] mb-2">Forgot password?</p>
        </Link>

        {/* ERROR */}
        {err && <p className="text-red-500 text-sm mb-2">{err}</p>}

        {/* SIGN IN BUTTON */}
        <button
          onClick={signInApi}
          disabled={loading}
          className="w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white py-2 rounded-lg flex justify-center"
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"}
        </button>

        {/* GOOGLE SIGNIN */}
        <button
          onClick={handleGoogle}
          className="w-full mt-4 border py-2 rounded-lg flex justify-center gap-2"
        >
          <FcGoogle size={20} /> Sign in with Google
        </button>

        {/* SIGN UP LINK */}
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#ff4d2d]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
