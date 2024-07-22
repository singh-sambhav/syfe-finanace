import express from "express"
import verifyToken from "../middlewares/verifyToken";
import { categoryController } from "../controllers";

const categoryRouter = express.Router()

categoryRouter.get("/:id",verifyToken,categoryController.getAllCategoryRequest);

export default categoryRouter;