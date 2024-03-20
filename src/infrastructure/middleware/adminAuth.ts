import { Request, Response, NextFunction } from 'express'
import JWT from '../utils/jwt';
import dotenv from 'dotenv';
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            adminId?: string
        }
    }
}

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    console.log('In adminAuth')

    // const token = req.headers.authorization?.split(' ')[1];
    let token = req.cookies.adminToken
    console.log(token);
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" })
    }

    try {
        const decoded = JWT.verifyToken(token)
        console.log(decoded)
        if (decoded && decoded.role !== 'admin') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
        }
        if (decoded && decoded.Id) {
            req.adminId = decoded.Id;
            next();   
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" })
        }

    } catch (err) {
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    }
}

export default adminAuth;