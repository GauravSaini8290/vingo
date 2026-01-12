import React from "react";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { Route, Routes } from "react-router-dom";
import ForgetPassword from "./components/ForgetPassword";
export const ServerUrl = "http://localhost:8000"

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default App;
