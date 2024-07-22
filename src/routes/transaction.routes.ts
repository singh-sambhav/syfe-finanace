import express from "express"
import { transactionController } from "../controllers";
import verifyToken from "../middlewares/verifyToken";

const transactionRouter = express.Router();

transactionRouter.post("/",verifyToken,transactionController.createTransactionRequest);
transactionRouter.patch("/update/:transactionId",verifyToken,transactionController.updateTransactionRequest);
transactionRouter.get("/:transactionId",verifyToken,transactionController.getTransactionRequest);
transactionRouter.get("/all/:id",verifyToken,transactionController.getAllTransactionRequest);
transactionRouter.delete("/:transactionId",verifyToken,transactionController.deleteTransactionRequest)

export default transactionRouter;