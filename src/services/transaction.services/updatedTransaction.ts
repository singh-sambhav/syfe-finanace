import { PrismaClient, transactionType } from "@prisma/client";
import { ServiceResponse } from "../../types/utils.types";


const prisma = new PrismaClient()

const response = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}
 
type updateTransactionType = {
    transactionId : number,
    userId: number,
    amount? : number,
    category? : string,
    description? : string,
    type? : transactionType

}

const updatedTransaction = async(data : updateTransactionType) : Promise<ServiceResponse>=>{

    
    try {
       
        const transaction = await prisma.transactions.findUnique({
            where : {
                id : data.transactionId
            }
        })
        


       if(!transaction){
            response.success = false;
            response.errorMsg = "No transaction found";
            return response
       }


       if(transaction.userId !== data.userId){
            response.success = false;
            response.errorMsg = "You are not authorized";
            return response
       }

       const newAmount = data.amount !== undefined ? data.amount : transaction.amount;
       const newCategory = data.category !== undefined ? data.category : transaction.category; 
       const newDesc = data.description !== undefined ? data.description : transaction.description;
       const newType = data.type !== undefined ? data.type : transaction.type

       
       if(newCategory !== transaction.category){

            const oldCategory = await prisma.category.update({
                where : {
                    userId_name : {
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

            if(oldCategory && oldCategory.count ==0){
                await prisma.category.delete({
                    where : {
                        id : oldCategory.id
                    }
                })
            }

            
            let newCategoryEntry = await prisma.category.findFirst({
                where : {
                    userId : data.userId,
                    name : newCategory
                }
            })



            if(!newCategoryEntry){
                newCategoryEntry = await prisma.category.create({
                    data : {
                        userId : data.userId,
                        count  : 1,
                        name : newCategory,
                        type : newType 
                    }
                })


            } else {

                await prisma.category.update({
                    where : {
                        id : newCategoryEntry.id
                    },
                    data : {
                        count : {
                            increment : 1
                        }
                    }
                });



            }
       }

       const updateTransaction = await prisma.transactions.update({
            where : {
                id : data.transactionId
            },
            data : {
                amount : newAmount,
                category : newCategory,
                description : newDesc,
                type : newType as transactionType
            }
       });

       response.success = true;
       response.data = updateTransaction;
       
       return response;

    } catch (error) {
        response.success = false;
        response.errorMsg = "Error at update Transaction serivce";
        return response
    }
}
export default updatedTransaction;