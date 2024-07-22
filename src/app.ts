import express , {Request, Response, NextFunction} from "express";
import cors from "cors";
import AppRouter from "./router"

const app = express();

app.use(cors());
app.use(express.json({limit : "16kb"}));

app.get("/" , (req: Request,res : Response)=>{
    res.status(200).send("Greetings from Syfe Personal Finance Server")
});

AppRouter();

export  {app};