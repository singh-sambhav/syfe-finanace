import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ServiceResponse } from '../types/utils.types';
import { PrismaClient } from "@prisma/client";

type JwtPayload = {
  id: number;
  email: string;
  [key: string]: any;
}

const response: ServiceResponse = {
    success: false,
    data: {},
    errorMsg: "Something went wrong!",
};

const prisma = new PrismaClient();

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const accessToken = req.headers['access-token'] as string;
    const refreshToken = req.headers['refresh-token'] as string;

    if (accessToken) {

      const token1 = accessToken.split(" ")[1]; // To remove Bearer

      jwt.verify(token1, process.env.ACCESS_TOKEN_SECRET!, async (err, data) => {

        if (err) {
          if (refreshToken) {
            const token2 = refreshToken.split(" ")[1]; // To remove Bearer

            jwt.verify(token2, process.env.REFRESH_TOKEN_SECRET!, async (err, data) => {
              if (err) {
                response.errorMsg = "You are not Authorized";
                return response;

              } else {

                const id = (data as JwtPayload).id;
                const user = await prisma.active_Sessions.findUnique({
                    where:{
                        userId:id,
                    }
                })

                if(token2 !== user?.refresh_token){
                    return res.status(401).json({ message: "You are not authorized" });
                }

                const newAccessToken = jwt.sign({
                  id: (data as JwtPayload).id,
                  email: (data as JwtPayload).email,
                }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "10m" });

                res.setHeader('access-token', newAccessToken); // Send new access token in headers
                const userId = (data as JwtPayload).id;
                const email = (data as JwtPayload).email;
                req.body.user = {userId,email};
                next();
              }
            });
          } else {
            response.errorMsg = "Refresh_token expired"
            return response;
          }
        } else {
          const userId = (data as JwtPayload).id;
          const email = (data as JwtPayload).email;
          req.body.user = {userId,email};


          next();
        }
      });
    } else {
        response.errorMsg = "Access token is required" 
        return response; 
    }
  } catch (error) {
    response.errorMsg = "Internal server error"
    return response;
  }
};

export default verifyToken;
