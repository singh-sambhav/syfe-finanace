import { PrismaClient } from "@prisma/client";
import { ServiceResponse } from "../../types/utils.types";

const primsa = new PrismaClient();

const response = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}

type getAllTransactionType = {
    id : number,
    userId : number,
}


const getAllTransaction = async(data : getAllTransactionType) : Promise<ServiceResponse>=>{

    try {
        
        if(data.id !== data.userId){
            response.success = false;
            response.errorMsg = "You are not authorized"
            return response;
        }

        const transactions = await primsa.transactions.findMany({
            where : {
                userId : data.userId
            }
        })

        console.log(transactions);
        
        if(!transactions){
            response.success = false;
            response.errorMsg = "No transactons found";
            return response;
        }

        response.success = true;
        response.data = transactions;
        return response;


    } catch (error) {
        response.success = false;
        response.errorMsg = "Error at getAllTransaction Controller";
        return response
    }

    
}

export default getAllTransaction;