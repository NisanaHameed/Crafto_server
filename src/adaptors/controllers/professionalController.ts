import {Request,Response} from 'express'
import Usecase from '../../use_case/profUsecase'

class ProfController{
    private usecase;
    constructor(usecase:Usecase){
        this.usecase = usecase;
    }
    async signup(req:Request,res:Response){
        try{
            const {email,password}= req.body;
            let profCheck = await this.usecase.findProf(email);
            if(!profCheck.data){
                req.app.locals.professional = {email,password};
                req.app.locals.otp = profCheck?.otp ;
                console.log(profCheck.otp)
                res.status(200).json({success:true});
            }else{
                res.status(409).json({ success: false,message:"Email already exists" });
            }
        }catch(err){
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async verifyOTP(req:Request,res:Response){
        try{
            let enteredOtp = req.body.otp;
            let otp = req.app.locals.otp;
            console.log(typeof enteredOtp);
            
            console.log(enteredOtp);
            if(enteredOtp===otp){
                let profdata = req.app.locals.professional;
                let saved = await this.usecase.saveProf(profdata);
                if(saved.success){
                    res.cookie('profToken',saved.token,{
                        expires:new Date(Date.now()+25892000000),
                        httpOnly:true
                    })
                    res.status(200).json({success:true,token:saved.token});
                }else{
                    res.status(401).json({success:false});
                }
            }else{
                console.log("Wrong OTP");
                res.status(400).json({success:false,message:"Incorrect otp"})
            }
        }catch(err){
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async fillProfile(req:Request,res:Response){
        try{
            console.log('In fillProfile controller');
            
            let data = req.body;
            let image = req.file?.filename
            console.log(data);
            console.log(image);
            
            data.image = image;
            let id = req.profId as string;
            let saved = await this.usecase.fillProfile(id,data);
            if(saved){
                res.status(200).json({success:true})
            }else{
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }

        }catch(err){
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async gsignup(req: Request, res: Response) {
        try {
            console.log('in gsignup')
            const { firstname, email, password } = req.body;
            const savedUser = await this.usecase.gSignup(firstname, email, password);
            if (savedUser.success) {
                res.status(200).json({ success: true, token: savedUser.token })
            } else {
                res.status(401).json({ message: savedUser.message })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async login(req:Request,res:Response){
        try{
            const {email,password} = req.body;
            let profCheck = await this.usecase.login(email,password);
            if(profCheck.success){
                res.cookie('profToken',profCheck.token,{
                    expires:new Date(Date.now()+25892000000),
                    httpOnly:true
                })
                res.status(200).json({success:true,token:profCheck.token})
            }else{
                res.status(401).json({message:profCheck.message})
            }
        }catch(err){
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getProfile(req:Request,res:Response){
        try{
            const id = req.profId;
            if(id){
                let profdata = await this.usecase.getProfile(id);
                res.status(200).json({success:true,profdata})
            }else{
                res.status(401).json({success:false,message:"Incorrect ID"})
            }
        }catch(err){
            console.log(err);
            res.status(500).json({success:false,message:"Internal server error"})
        }
    }
}

export default ProfController;