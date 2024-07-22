import { PrismaClient } from "@prisma/client";
import { ServiceResponse } from "../../types/utils.types";


const prisma = new PrismaClient();

const response = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}

type getTransactionType = {
    transactionId : number,
    userId : number
}

const getTransaction  = async(data:getTransactionType) : Promise<ServiceResponse> =>{

    try {
        
        const transaction = await prisma.transactions.findUnique({
            where : {
                id : data.transactionId   
            }
        })

        if(!transaction){
            response.success = false
            response.errorMsg = "No Transaction Exists"
            return response
        }

        if(transaction.userId !== data.userId){
            response.success = false;
            response.errorMsg = "You are nor authorized";
            return response;
        }


        response.success = true;
        response.data = transaction;
        return response;


    } catch (error) {
        
        response.success = false;
        response.errorMsg = "Error at getTransaction Controller";
        return response;

    }

    return response
}

export default getTransaction;