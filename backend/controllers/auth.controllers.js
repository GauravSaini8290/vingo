import jwtToken from "../utils/token.js"
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendOtpMail } from "../utils/mail.js";
export const SignUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        if (!fullName || !email || !password || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const normalizedEmail = email.toLowerCase();

        const findUser = await User.findOne({ email: normalizedEmail })
        if (findUser) {
            return res.status(400).json({ message: " User already exists" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: " password must be at least 6 cahracters" })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: " mobile must be at least 10 digits" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            fullName, email, password: hashedPassword, mobile, role
        })
        const token = await jwtToken(user._id)
        res.cookie("token", token, {
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                location: user.location
            },
        });

    } catch (error) {
        return res.status(500).json({ message: "Signup error", error: error.message });
    }
}



export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const normalizedEmail = email.toLowerCase();
        const findUser = await User.findOne({ email: normalizedEmail })
        if (!findUser) {
            return res.status(400).json({ message: " User dose not exist," })
        }

        const isPasswordMatch = await bcrypt.compare(password, findUser.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: " incorrect password" })
        }
        const token = await jwtToken(findUser._id)
        res.cookie("token", token, {
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: findUser._id,
                fullName: findUser.fullName,
                email: findUser.email,
                role: findUser.role,
                location: findUser.location
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Signin error", error: error.message });
    }
}




export const SignOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false
        })
        return res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        return res.status(500).json({ message: "SignOut error", error: error.message });
    }
}


export const SentOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: " User dose not exist," })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false
        await user.save()
        await sendOtpMail(email, otp)
        return res.status(200).json({
            message: "otp sended"
        })
    }
    catch (error) {
        return res.status(500).json({ message: `send otp error ${error}` })
    }
}


export const VerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "invalide otp" })
        }
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({
            message: "otp verified "
        })
    } catch (error) {
        return res.status(500).json({ message: `verifyOtp ${error}` })
    }
}
export const ResetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: " otp varification required" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({
            message: " password reset  "
        })
    } catch (error) {
        return res.status(500).json({ message: ` reset otp error ${error}` })
    }

}

export const GoogleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile, role } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                email
            })
        }

        const token = await jwtToken(user._id)
        res.cookie("token", token, {
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                location: user.location
            },
        });
    } catch (error) {
        return res.status(500).json({ message: ` Google auth error: ${error}` })
    }
}
