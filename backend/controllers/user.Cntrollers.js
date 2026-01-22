import User from "../models/user.model.js"
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: " user id  not found" })
        }
        const user = await User.findById(userId)
        if(!user) {
            return res.status(400).json({ message: " user  not found" })
        }
        return res.status(200).json({
  user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  }
})
    } catch (error) {
return res.status(400).json({ message: ` get current user error ${error}` })
    }
}