import express from "express";
import { SignIn, SignOut, SignUp } from "../controllers/auth.controllers.js";
const authRouter = express.Router()
authRouter.post("/signUp" , SignUp)
authRouter.post("/signIn" , SignIn)
authRouter.get("/signOut" , SignOut)
export default authRouter