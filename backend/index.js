import express from "express"
import dotenv from "dotenv"
import { socketHandler } from "./socket.js"
import connectdb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import cors from "cors"
import shopRouter from "./routes/shop.routes.js"
import itemRouter from "./routes/items.routes.js"
import orderRouter from "./routes/order.routes.js"
import http, { createServer } from "http"
import { Server } from "socket.io"
dotenv.config()
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["POST", "GET"]
    }
})
app.set("io", io)
const port = process.env.PORT || 5000
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())
app.use("/public", express.static("public"));
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)
socketHandler(io)
server.listen(port, async () => {
    await connectdb()
    console.log(`🚀 Server started at port ${port}`);
})