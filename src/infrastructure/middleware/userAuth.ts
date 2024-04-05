import {Request,Response,NextFunction} from 'express'
import JWT from '../utils/jwt';
import dotenv from 'dotenv';
import UserRepository from '../repository/userRepository';
const repository = new UserRepository();
const jwt = new JWT();
dotenv.config()

declare global {
    namespace Express{
        interface Request{
            userId?:string
        }
    }
}

const userAuth = async (req:Request,res:Response,next:NextFunction)=>{
  
    let token = req.cookies.userToken;
    if(!token){
        return res.status(401).json({success:false,message:"Unauthorized - No token provided"})
    }

    try{
        const decoded = jwt.verifyToken(token) 
        if(decoded && decoded.role!=='user'){
            return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
        }
        
        if(decoded && decoded.Id){
            let user = await repository.findUserById(decoded.Id);
            if(user?.isBlocked){
                return res.status(401).send({success:false,message:"User is blocked by admin!"})
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