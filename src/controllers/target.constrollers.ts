import { ApiError, ApiResponse, asyncHandler } from "../utils";
import {Request , Response} from "express"
import { addTargetRequestBodyType } from "../types/target.types";
import { addTarget, getProgress} from "../services/target.services";

const addTargetRequest = asyncHandler(async (req:Request , res:Response)=>{

    const {amount,date} = req.body as addTargetRequestBodyType;
    const {userId} = req.body.user;

    const isTargetAdded = await addTarget({amount,date,userId});

    if(!isTargetAdded.success){
        throw new ApiError(500,isTargetAdded.errorMsg);
    }

    res.status(201)
        .json(new ApiResponse(201,isTargetAdded.data,"Target added Successfully"));

})


const getTargetProgress = asyncHandler(async(req:Request,res:Response)=>{

    const targetId = Number(req.params.targetId)
    const {userId} = req.body.user;

    const isProgressFetched = await getProgress({targetId,userId});

    if(!isProgressFetched.success) {
        throw new ApiError(500,isProgressFetched.errorMsg)
    }

    res.status(201)
        .json( new ApiResponse(201,isProgressFetched.data,"Targets successfully fetched"));
})

export default {
    addTargetRequest,
    getTargetProgress
}