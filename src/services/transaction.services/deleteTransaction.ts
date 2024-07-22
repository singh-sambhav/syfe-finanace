import { PrismaClient } from "@prisma/client";
import { ServiceResponse } from "../../types/utils.types";

const prisma = new PrismaClient();

const response = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}

type deleteTransactionType = {
    transactionId : number,
    userId : number
}

const deleteTransaction = async(data:deleteTransactionType): Promise<ServiceResponse>=>{

    try {

        const transaction = await prisma.transactions.findUnique({
            where : {
                id : data.transactionId
            }
        })

        if(!transaction){
            response.success = false;
            response.errorMsg = "No such transaction found"
            return response;
        }

        if(transaction.userId!== data.userId){
            response.success = false;
            response.errorMsg = "You are not authorized"
            return response;
        }


        const category = await prisma.category.findFirst({
            where : {
                userId : data.userId,
                name : transaction.category
            }
        })

        if(category){
            if(category.count > 1){
                await prisma.category.update({
                    where : {
                        userId_name: {
                            userId : data.userId,
                            name : transaction.category
                        }
                    },
                    data : {
                        count : {
                            decrement : 1
                        }
                    }
                })
            }
            else{

                await prisma.category.delete({
                    where : {
                        userId_name :{
                            userId : data.userId,
                            name : transaction.category
                        }
                    }
                })
            }
        }



        const deletedTransaction = await prisma.transactions.delete({
            where : {
                id : data.transactionId,
            }
        })

        response.success = true;
        return response;

    } catch (error) {
        response.success = false;
        response.errorMsg = "Error at DeleteTransaction Controller";
        return response;
    }
    
}

export default deleteTransaction;