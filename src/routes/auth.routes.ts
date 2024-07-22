import express from "express"
import { authController } from "../controllers";
import verifyToken from "../middlewares/verifyToken";

const authRouter = express.Router();

authRouter.post("/signup" , authController.createUserRequest)
authRouter.post("/login" , authController.loginUserRequest)
authRouter.post("/logout", verifyToken,authController.logoutUserRequest)

export default authRouter