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
    console.log('token...',token)
    if(!token){
        return res.status(401).json({success:false,message:"Unauthorized"})
    }

    try{
        const decoded = jwt.verifyToken(token) 
        console.log('decoded....',decoded)
        if(decoded && decoded.role!=='user'){
            return res.status(401).send({success:false,message:"Unauthorized"})
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
            return res.status(401).json({success:false,message:"Unauthorized"})
        }
    
    }catch(err:any){
        if(err.name==='TokenExpiredError'){
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).send({success:false,message:"Unauthorized"})
    }
}

export default userAuth;