import { PrismaClient } from "@prisma/client"
import { ServiceResponse } from "../../types/utils.types"

const prisma = new PrismaClient();

const response = {
    success : false,
    data : {},
    errorMsg  : "Something went wrong"
}

type addTargetType = {
    amount : number;
    date : Date;
    userId : number;
}

const addTarget = async(data : addTargetType) : Promise<ServiceResponse>=>{

    try {

        const date = new Date().toISOString();

        const savingTarget = await prisma.target.create({
            data : {
                userId : data.userId,
                targetAmount : data.amount,
                targetDate : data.date,
                createdAt : date,
            }
        })

        if(!savingTarget){

            response.success = false;
            response.errorMsg = "Error at addTarget";
            return response;
        }

        response.success = true;
        response.data = savingTarget;
        return response;

    } catch (error) {
        response.success = false;
        response.errorMsg = "Error at addTarget Controller"
        return response
    }
}

export default addTarget