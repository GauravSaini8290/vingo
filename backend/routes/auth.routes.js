import express from "express";
import { SignIn, SignOut, SignUp, SentOtp, VerifyOtp, ResetPassword ,GoogleAuth} from "../controllers/auth.controllers.js";
const authRouter = express.Router()
authRouter.post("/signUp", SignUp)
authRouter.post("/signIn", SignIn)
authRouter.get("/signOut", SignOut)
authRouter.post("/send-otp", SentOtp)
authRouter.post("/verify-otp", VerifyOtp)
authRouter.post("/reset-password", ResetPassword)
authRouter.post("/google-auth", GoogleAuth)
export default authRouter