import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { getDeliveryBoyAssignment, getMyOrder, placeOrder, updateOrderStatus, acceptOrder, getCurrentOrder, getOrderById, sendDeliveryOtp, verifyDeliveryOtp } from "../controllers/orderControllers.js"
const orderRouter = express.Router()
orderRouter.post("/place-order", isAuth, placeOrder)
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp)
orderRouter.post("/verify-delivery-otp", isAuth, verifyDeliveryOtp)
orderRouter.get("/my-orders", isAuth, getMyOrder)
orderRouter.get("/my-assignment", isAuth, getDeliveryBoyAssignment)
orderRouter.get("/get-curent-order", isAuth, getCurrentOrder)
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus)
orderRouter.get("/accept-order/:assignmentId", isAuth, acceptOrder)
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById)
export default orderRouter