import { Request, Response, NextFunction } from 'express'
import JWT from '../utils/jwt';
import dotenv from 'dotenv';
import ProfRepository from '../repository/profRepository';
const repository = new ProfRepository();
dotenv.config()
const jwt = new JWT();

declare global {
    namespace Express {
        interface Request {
            profId?: string
        }
    }
}

const profAuth = async (req: Request, res: Response, next: NextFunction) => {
    console.log('In ProfAuth')

    let token = req.cookies.profToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "Please Login!" })
    }

    try {
        const decoded = jwt.verifyToken(token)
        if (decoded && decoded.role !== 'professional') {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

        if (decoded && decoded.Id) {
            let user = await repository.findProfById(decoded.Id);
            if (user?.isBlocked) {
                return res.status(401).json({ success: false, message: "Professional is blocked by admin!" })
            } else {
                req.profId = decoded.Id;
                next();
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }

    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }
}

export default profAuth;