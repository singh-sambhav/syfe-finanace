import { ServiceResponse } from "../../types/utils.types"
import { PrismaClient, transactionType } from "@prisma/client"

const prisma = new PrismaClient();

const response = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}

type addTransactionType = {
    userId: number,
    amount : number,
    category : string,
    description? : string,
    type : transactionType

}

const addTransaction = async (data : addTransactionType) : Promise<ServiceResponse> =>{

    try {
        if(!data.userId || !data.amount || !data.category || !data.type){
            response.success = false;
            return response
        }


        const user = await prisma.user.findUnique({
            where : {
                id : data.userId
            }
        })


        if(!user){
            response.errorMsg = "User Does Not Exist";
            return response;
        }

        const date = new Date().toISOString();

        const transaction = await prisma.transactions.create({
            data : {
                userId : data.userId,
                amount : data.amount,
                date  : date,
                category : data.category,
                description : data.description || "",
                type : data.type
            }
        })

        const category = await prisma.category.findFirst({
           where : {
                userId : data.userId,
                name : data.category
           }
        })

        if(!category){
            await prisma.category.create({
                data : {
                    name : data.category,
                    userId : data.userId,
                    count : 1,
                    type : data.type
                }
            })
        }
        else{
            await prisma.category.update({
                where : {
                    userId_name : {
                        userId : data.userId,
                        name : data.category
                    }
                },
                data :{
                    count : {
                        increment : 1
                    }
                }
            })
        }

        response.success = true;
        response.data  = transaction;
        return response;

        
    } catch (error) {
        response.success = false;
        response.errorMsg = "Error at add Transaction"
        return response
    }   
}

export default addTransaction