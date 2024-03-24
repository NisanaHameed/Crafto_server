import { Request, Response } from "express"
import Userusecase from "../../use_case/userUsecase";
import User from "../../domain/user";

class UserController {
    private Userusecase;
    constructor(Userusecase: Userusecase) {
        this.Userusecase = Userusecase
    }

    async signup(req: Request, res: Response) {
        try {
            const { name, email, mobile, password } = req.body;
            console.log(name, '+', email)
            const userData = { name, email, mobile, password }
            let userCheck: any = await this.Userusecase.findUser(userData as User);
            console.log(userCheck)
            if (!userCheck.data) {
                const token = userCheck?.token;
                console.log(userCheck?.token);
                res.status(200).json({ success: true, token })
            } else {
                res.send(409).json({ success: false, message: "Email already exists" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async verifyOTP(req: Request, res: Response) {
        try {
            console.log('in verifyotp');

            let token = req.headers.authorization?.split(' ')[1] as string
            console.log('token' + token)
            let userOtp = req.body.otp;
            let saveduser = await this.Userusecase.saveUSer(token, userOtp)
            if (saveduser.success) {
                res.cookie('userToken', saveduser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json(saveduser)
            } else {
                res.status(402).json({ success: false, message: saveduser.message })
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
                res.cookie('userToken', userCheck.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json({ success: true, token: userCheck.token })
            } else {
                res.status(401).json({ success: false, message: userCheck.message })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error!' })
        }

    }

    async gsignup(req: Request, res: Response) {
        try {
            console.log('in gsignup')
            const { name, email, password } = req.body;
            const savedUser = await this.Userusecase.gSignup(name, email, password);
            if (savedUser.success) {
                res.status(200).json({ success: true, token: savedUser.token })
            } else {
                res.status(401).json({ message: savedUser.message })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (userId) {
                let userdata = await this.Userusecase.getProfile(userId);
                res.status(200).json({ success: true, userdata });
            } else {
                res.status(401).json({ success: false, message: "UserId is not found" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }
    async editProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const { editedData } = req.body

        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error!" })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('userToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err);

        }
    }

}

export default UserController;