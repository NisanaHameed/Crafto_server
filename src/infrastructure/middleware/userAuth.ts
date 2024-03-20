import {Request,Response,NextFunction} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import JWT from '../utils/jwt';
import dotenv from 'dotenv';
import UserRepository from '../repository/userRepository';
const repository = new UserRepository();
dotenv.config()

declare global {
    namespace Express{
        interface Request{
            userId?:string
        }
    }
}

const userAuth = async (req:Request,res:Response,next:NextFunction)=>{
    
    // const token = req.headers.authorization?.split(' ')[1];
    let token = req.cookies.userToken;
    if(!token){
        return res.status(401).json({success:false,message:"Unauthorized - No token provided"})
    }

    try{
        const decoded = JWT.verifyToken(token) 
        if(decoded && decoded.role!=='user'){
            return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
        }
        
        if(decoded && decoded.Id){
            let user = await repository.findUserById(decoded.Id);
            if(user?.isBlocked){
                return res.status(401).send({success:false,message:"User is blocked"})
            }else{
                req.userId = decoded.Id;
            next();
            }  
        }else{
            return res.status(401).json({success:false,message:"Unauthorized - Invalid token"})
        }
    
    }catch(err){
        return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
    }
}

export default userAuth;