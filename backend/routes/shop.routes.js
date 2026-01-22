import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createEditShop, getMyShop } from "../controllers/shopControllers.js";
import {upload} from "../middlewares/multer.js"


const shopRouter = express.Router()

shopRouter.post("/create-edit", isAuth, upload.single("image"), createEditShop)
shopRouter.get("/getMyShop", isAuth, getMyShop)

export default shopRouter