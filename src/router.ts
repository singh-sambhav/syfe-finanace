import { app } from "./app";
import authRouter from "./routes/auth.routes";
import categoryRouter from "./routes/category.routes";
import targetRouter from "./routes/target.routes";
import transactionRouter from "./routes/transaction.routes";

function Router(){
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/transaction", transactionRouter)
    app.use("/api/v1/category",categoryRouter)
    app.use("/api/v1/target", targetRouter)
}

export default Router;