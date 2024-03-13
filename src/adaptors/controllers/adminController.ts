import { Request, Response } from 'express'
import AdminUsecase from "../../use_case/adminUsecase";

class AdminController {
    private usecase;
    constructor(usecase: AdminUsecase) {
        this.usecase = usecase;
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            let data = await this.usecase.login(email, password);
            if (data.success) {
                res.status(200).json(data)
            } else {
                res.status(401).json(data)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getUsers(req: Request, res: Response) {
        try {
            let users = await this.usecase.getUsers();
            if (users) {
                res.status(200).json({ success: true, users })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async blockUser(req: Request, res: Response) {
        try {
            let userId = req.params.id;
            console.log('userid'+userId)
            let blocked = await this.usecase.blockUser(userId);
            if (blocked) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getProfessionals(req:Request,res:Response){
        try{
            let profs = await this.usecase.getProfessionals();
            if (profs) {
                res.status(200).json({ success: true, profs })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        }catch(err){
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async blockProfessional(req:Request,res:Response){
        try{
            let profId = req.params.id;
            let blocked = await this.usecase.blockProfessional(profId);
            if (blocked) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        }catch(err){
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export default AdminController;