import { Request, Response } from "express";
import { SignupReqBodyType  , LoginReqBodyType, LogoutReqBodyType} from "../types/auth.types";
import { createUser , loginUser, logoutUser } from "../services/auth.services";
import { ApiError,ApiResponse,asyncHandler } from "../utils";


const createUserRequest = asyncHandler(async (req:Request, res:Response)=>{
    
    const userData = req.body as SignupReqBodyType;
    const isUserCreated = await createUser(userData);

    if(!isUserCreated.success){
        throw new ApiError(500,isUserCreated.errorMsg);
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201,isUserCreated.data,"User Created successfully")
        )

})

const loginUserRequest = asyncHandler(async(req : Request, res : Response)=>{
    const userData = req.body as LoginReqBodyType;
    const isLoggedIn = await loginUser(userData);

    
    

    if(!isLoggedIn.success){
        throw new ApiError(500,isLoggedIn.errorMsg);
    }
    return res
        .status(201)
        .json(new ApiResponse(201,isLoggedIn.data,"User Logged In"));
});

const logoutUserRequest = asyncHandler(async(req:Request,res:Response)=>{

    const {email,userId} = req.body.user as LogoutReqBodyType
    const isLoggedOut = await logoutUser({email,userId});

    if(!isLoggedOut.success){
        throw new ApiError(500,isLoggedOut.errorMsg);
    }

    return res
            .status(201)
            .json(new ApiResponse(201,isLoggedOut.data,"User Logged Out Successfully"))

})

export default {
    createUserRequest,
    loginUserRequest,
    logoutUserRequest
}