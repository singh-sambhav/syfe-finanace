import { ServiceResponse } from "../../types/utils.types";
import jwt from "jsonwebtoken";

const response : ServiceResponse = {
    success : false,
    data : {},
    errorMsg : "Something Went Wrong"
}

const generateToken = async (tokenInput : {
    id : number,
    email : string
}): Promise<ServiceResponse> =>{

    try {
            const accessToken = generateAccessToken(tokenInput);
            const refreshToken = generateRefreshToken(tokenInput);

            response.success = true;
            response.data = {accessToken,refreshToken}
            return response

    } catch (error) {
        return response;
    }

}

const generateAccessToken = (tokenInput :  {
    id : number,
    email : string
}) =>{
    
    if(!process.env.ACCESS_TOKEN_SECRET){
        throw new Error("ACCESS_TOKEN_SECRET is not defined")
    }

    const token = jwt.sign({
        id : tokenInput.id,
        email : tokenInput.email,
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10m"});

    
    return token;
}

const generateRefreshToken = (tokenInput :  {
    id : number,
    email : string
}) =>{

    if(!process.env.REFRESH_TOKEN_SECRET){
        throw new Error("REFRESH_TOKEN_SECRET is not defined")
    }

    const token = jwt.sign({
        id : tokenInput.id,
        email : tokenInput.email,
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:"1hr"});

    return token;
}

export default generateToken;