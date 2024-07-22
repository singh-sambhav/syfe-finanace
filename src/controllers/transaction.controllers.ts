import { Request,Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../utils";
import { TransactionReqBodyType, UpdateTransactionReqBodyType } from '../types/transaction.types';
import { addTransaction, updatedTransaction , getTransaction , getAllTransaction , deleteTransaction} from '../services/transaction.services';

const createTransactionRequest = asyncHandler(async(req:Request , res:Response)=>{

    const {amount,category,description,type} = req.body as TransactionReqBodyType;
    const {userId} = req.body.user    

    const isTransactionCreated = await addTransaction({userId,amount,category,description,type});

    if(!isTransactionCreated.success){
        throw new ApiError(500,isTransactionCreated.errorMsg)
    }

    res.status(201)
       .json(new ApiResponse(201,isTransactionCreated.data,"Transaction Added Successfully"))
})

const updateTransactionRequest = asyncHandler(async(req:Request , res:Response)=>{
    
    const transactionId = Number(req.params.transactionId);
    const {amount,category,description,type} = req.body as UpdateTransactionReqBodyType;
    const {userId} = req.body.user;

    const isTransactionUpdated = await updatedTransaction({transactionId,userId,amount,category,description,type});

    if(!isTransactionUpdated.success){
        throw new ApiError(500,isTransactionUpdated.errorMsg);
    }

    res.status(201)
        .json(new ApiResponse(201,isTransactionUpdated.data,"Transaction Updated Successfully"))

})

const getTransactionRequest = asyncHandler(async(req:Request , res:Response)=>{

    const transactionId = Number(req.params.transactionId);
    const{userId} = req.body.user;

    const isTransactionFetched = await getTransaction({transactionId,userId});

    if(!isTransactionFetched.success){
        throw new ApiError(500,isTransactionFetched.errorMsg);
    }

    console.log(isTransactionFetched.errorMsg);
    res.status(201)
        .json(new ApiResponse(201,isTransactionFetched.data,"Transaction Feteched Successfully"))
})

const getAllTransactionRequest = asyncHandler(async(req:Request, res:Response)=>{

    const {userId} = req.body.user;
    const id = Number(req.params.id);

    const isAllTransactionsFetched = await getAllTransaction({userId,id});

    if(!isAllTransactionsFetched.success){
        throw new ApiError(500,isAllTransactionsFetched.errorMsg);
    }

    res.status(201)
        .json( new ApiResponse(201,isAllTransactionsFetched.data,"All Transactions Fetched Successfully"))
})

const deleteTransactionRequest = asyncHandler(async(req:Request,res:Response)=>{

    const transactionId = Number(req.params.transactionId);
    const {userId} = req.body.user;

    const isTransactionDeleted = await deleteTransaction({transactionId,userId})

    if(!isTransactionDeleted.success){
        throw new ApiError(500,isTransactionDeleted.errorMsg)
    }

    res.status(201)
        .json( new ApiResponse(201,"","Transaction Deleted Successfullt"));
})


export default{
    createTransactionRequest,
    updateTransactionRequest,
    getTransactionRequest,
    getAllTransactionRequest,
    deleteTransactionRequest
}