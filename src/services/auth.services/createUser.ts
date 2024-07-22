import { ServiceResponse } from '../../types/utils.types';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient();


const response : ServiceResponse = {
    success : false,
    data : {},
    errorMsg : "Something Went Wrong"
}

type createUserType = {
    name : string,
    email : string,
    password : string
}

const createUser = async({name,email,password} : createUserType) : Promise<ServiceResponse> =>{

    try {
        if(!name || !email || !password){
            response.errorMsg = "Invalid Inputs";
            return response;
        }

        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(user){
            response.errorMsg = "User Already Exists";
            return response;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await prisma.user.create({
            data : {
                name,
                email,
                password : hashedPassword
            },
            select:{
                id : true,
                email : true,
                name : true
            }
        });

        response.success = true;
        response.data = newUser;
        return response

    } catch (error) {
        return  response;
    }
}

export default createUser;