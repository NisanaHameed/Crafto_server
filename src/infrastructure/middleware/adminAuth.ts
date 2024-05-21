import { Request, Response, NextFunction } from 'express'
import JWT from '../utils/jwt';
import dotenv from 'dotenv';
dotenv.config()
const jwt = new JWT();

declare global {
    namespace Express {
        interface Request {
            adminId?: string
        }
    }
}

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    
    let token = req.cookies.adminToken
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verifyToken(token)
        if (decoded && decoded.role !== 'admin') {
            return res.status(401).send({ success: false, message: "Unauthorized" })
        }
        if (decoded && decoded.Id) {
            req.adminId = decoded.Id;
            next();   
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

    } catch (err:any) {
        if(err.name==='TokenExpiredError'){
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).send({ success: false, message: "Unauthorized" })
    }
}

export default adminAuth;