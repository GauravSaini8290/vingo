import jwt from "jsonwebtoken"
const jwtToken = async (userId) => {
    try {
        const jwtToken = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return jwtToken
    } catch (error) {
        console.log(error)
    }
}
export default jwtToken 