import { PrismaClient } from "@prisma/client";
import { ServiceResponse } from "../../types/utils.types";
import test from "node:test";

const prisma = new PrismaClient();

const response = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}

type getProgressType = {
    targetId: number;
    userId : number
}

const getProgress = async(data : getProgressType) : Promise<ServiceResponse>=>{

    try {
        
        const target = await prisma.target.findUnique({
            where : {
                id : data.targetId
            }
        })

        if(!target){
            response.success = false;
            response.errorMsg = "No Target Found"
            return response
        }

        if(data.userId !== target.userId){
            response.success = false;
            response.errorMsg = "You are not authorized";
            return response
        }

        const incomeSum = await prisma.transactions.findMany({
            where : {
                userId : data.userId,
                date : {
                    gte : target.createdAt,
                    lte : target.targetDate
                },
                type : "INCOME"
            },
            select:{
                amount : true
            }
        })

        const expenseSum = await prisma.transactions.findMany({
            where : {
                userId : data.userId,
                date : {
                    gte : target.createdAt,
                    lte : target.targetDate
                },
                type : "EXPENSE"
            },
            select : {
                amount : true
            }
        })

        let finalIncomeSum = 0 ;
        for(let i =0 ; i<incomeSum.length ; i++){
            finalIncomeSum += incomeSum[i].amount;
        }

        let finalExpenseSum = 0;
        for(let i =0 ; i<expenseSum.length; i++){
            finalExpenseSum += expenseSum[i].amount;
        }

        const totalSaving = finalIncomeSum - finalExpenseSum;

        

        const updatedTarget = await prisma.target.update({
            where : {
                id : data.targetId
            },
            data : {
                completed : true
            }
        })
        
        

        if(totalSaving<target.targetAmount){
            response.success = true;
            response.data = target;
            return response;
        }

        response.success = true;
        response.data = updatedTarget;
        return response;



    } catch (error) {
        
        response.success = false;
        response.errorMsg = "Error at getProgress Controller";
        return response;
    }

}

export default getProgress;