import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { getDeliveryBoyAssignment, getMyOrder, placeOrder, updateOrderStatus, acceptOrder, getCurrentOrder } from "../controllers/orderControllers.js"
const orderRouter = express.Router()
orderRouter.post("/place-order", isAuth, placeOrder)
orderRouter.get("/my-orders", isAuth, getMyOrder)
orderRouter.get("/my-assignment", isAuth, getDeliveryBoyAssignment)
orderRouter.get("/accept-order/:assignmentId", isAuth, acceptOrder)
orderRouter.get("/get-curent-order", isAuth, getCurrentOrder)
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus)
export default orderRouter