
import { ApiError, ApiResponse, asyncHandler } from "../utils";
import { Request,Response } from "express";
import { getAllCategory } from "../services/category.services";



const getAllCategoryRequest = asyncHandler(async(req:Request,res:Response)=>{

    const {userId} = req.body.user;
    const id =  Number(req.params.id);

    const isAllCategoryFetched = await getAllCategory({id,userId});

    if(!isAllCategoryFetched.success){
        throw new ApiError(500,isAllCategoryFetched.errorMsg);
    }

    res.status(201)
        .json( new ApiResponse(201,isAllCategoryFetched.data,"All categoires fetched successfully"));
})

export default {
    getAllCategoryRequest
}