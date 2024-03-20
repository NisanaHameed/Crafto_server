import { Request, Response } from "express"
import Userusecase from "../../use_case/userUsecase";

class UserController {
    private Userusecase;
    constructor(Userusecase: Userusecase) {
        this.Userusecase = Userusecase
    }

    async signup(req: Request, res: Response) {
        try {
            const { name, email, mobile, password } = req.body;
            console.log(name, '+', email)
            let userCheck: any = await this.Userusecase.findUser(email);
            console.log(userCheck)
            if (!userCheck.data) {
                req.app.locals.user = { name, email, mobile, password }
                req.app.locals.otp = userCheck?.otp;
                console.log(userCheck?.otp);         
                res.status(200).json({ success: true })
            } else {
                res.send(409).json({ success: false,message:"Email already exists" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async verifyOTP(req: Request, res: Response) {
        try {
            console.log('in verifyotp');
            
            let enteredOtp = req.body.otp;
            let otp = req.app.locals.otp;
            console.log(enteredOtp)
            console.log(otp);

            if (enteredOtp === otp) {
                let userdata = req.app.locals.user;
                let saveduser: any = await this.Userusecase.saveUSer(userdata);
                if (saveduser.success) {
                    res.cookie('userToken',saveduser.token,{
                        expires:new Date(Date.now()+25892000000),
                        httpOnly:true
                    })
                    res.status(200).json(saveduser)
                } else {
                    res.status(500).json({ success: false });
                }
            } else {
                console.log('wrong otp');
                res.status(401).json({ success: false });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }

    }
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            let userCheck: any = await this.Userusecase.login(email, password);
            console.log(userCheck)
            if (userCheck.success) {
                res.cookie('userToken',userCheck.token,{
                    expires:new Date(Date.now()+25892000000),
                    httpOnly:true
                })
                res.status(200).json({success:true,token:userCheck.token })
            } else {
                res.status(402).json({message:userCheck.message})
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error!' })
        }

    }
    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                let userdata = await this.Userusecase.getProfile(userId);
                res.status(200).json({success:true,userdata});
            }else{
                res.status(401).json({success:false,message:"UserId is not found"})
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }
    async editProfile(req:Request,res:Response){
        try{
            const userId = req.userId;
            const {editedData} = req.body
            
        }catch(err){
            console.log(err);
            res.status(500).json({success:false,message:"Internal server error!"})    
        }
    }

}

export default UserController;