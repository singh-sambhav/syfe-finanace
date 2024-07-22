import { ApiError } from '../../utils';
import { ServiceResponse } from './../../types/utils.types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const response : ServiceResponse = {
    success : false,
    data : {},
    errorMsg : "Something went wrong"
}

type LogOutUserType = {
    userId: number;
    email: string;
  };

const logoutUser = async({
    email,
    userId
}: LogOutUserType): Promise<ServiceResponse>=>{

    try {
        if(!email || !userId){
            response.errorMsg = "Invalid inputs passed";
            return response
        }
    
        const user = await prisma.active_Sessions.findUnique({
            where : {
                userId : Number(userId),
            }
        })
    
        if(!user){
            response.errorMsg = "User not loggedIn"
            return response;
        }
    
        const isUserLoggedOut = await prisma.active_Sessions.delete({
            where : {
                userId : userId,
            },
            select : {
                id : true,
                userId : true,
            }
        })
    
        if(!isUserLoggedOut) throw new ApiError(500,"Error at logout controller")
    
        response.success = true;
        response.data =  isUserLoggedOut;
        return response
    } catch (error) {
        return response;
    }
}


export default logoutUser;