import { PrismaClient } from "@prisma/client";
import { ServiceResponse } from "../../types/utils.types";

const prisma = new PrismaClient();

const response = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}

type getAllCategoryType = {
    id : number,
    userId : number
}

const getAllCategory = async(data : getAllCategoryType) :Promise<ServiceResponse>=>{

    try {
        if(data.id !== data.userId){
            response.success = false;
            response.errorMsg = "You are not authorized"
            return response;
        }
    
        const category = await prisma.category.findMany({
            where : {
                userId : data.userId
            }
        })


        if(!category){
            response.success = false;
            response.errorMsg = "This user has no categories"
            return response;
        }

        response.success = true;
        response.data = category;
        return response


    } catch (error) {
        
        response.success = false;
        response.errorMsg = "Error at GetAllCategory controller"
        return response;
    }

}

export default getAllCategory;