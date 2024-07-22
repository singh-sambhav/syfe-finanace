import express from "express"
import verifyToken from "../middlewares/verifyToken";
import targetConstrollers from "../controllers/target.constrollers";

const targetRouter = express.Router();

targetRouter.post("/",verifyToken,targetConstrollers.addTargetRequest)
targetRouter.get("/targetProgress/:targetId",verifyToken , targetConstrollers.getTargetProgress)


export default targetRouter