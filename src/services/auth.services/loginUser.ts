import { ServiceResponse } from './../../types/utils.types';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import generateToken from './generateToken';

const prisma = new PrismaClient();

const response : ServiceResponse = {
    success :false,
    data : "",
    errorMsg : "Something went wrong"
}

type loginUserType = {
    email : string,
    password : string
}

const loginUser = async({email,password}:loginUserType) : Promise<ServiceResponse>=>{

    
   try {
     if(!email || !password) {
         response.errorMsg = "Invalid Inputs passed";
         return response
     }
     
     
    const user = await prisma.user.findUnique({
            where : {
                email
            }
    })


 
     if(!user){
         response.errorMsg = "User does not exist"
         return response
     }

 
     const originalPassword = await bcrypt.compare(password,user.password)

     if(!originalPassword){
         response.errorMsg = "Invalid Password";
         return response
     }
 
     const tokenInput = {id :user.id, email :user.email};
     const res = await generateToken(tokenInput);

     if(!res.success){
         response.errorMsg = res.errorMsg;
         return response
     }
 
    await prisma.active_Sessions.create({
        data : {
            userId : user.id,
            refresh_token : res.data.refreshToken
        }
    })


     response.success = true;
     response.data = res.data;
     return response
   } catch (error) {
    return response
   }
}

export default loginUser;