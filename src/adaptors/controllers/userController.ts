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
            const { name, email, password } = req.body;
            console.log(name, '+', email)
            const userData = { name, email, password }
            let userCheck = await this.Userusecase.findUser(userData as User);
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
            let token = req.headers.authorization?.split(' ')[1] as string
            let userOtp = req.body.otp;
            let saveduser = await this.Userusecase.saveUSer(token, userOtp)
            if (saveduser.success) {
                res.cookie('userToken', saveduser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                })
                res.status(200).json(saveduser)
            } else {
                res.status(402).json({ success: false, message: saveduser.message })
            }

        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }

    }

    async resendOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string;
            let newToken = await this.Userusecase.resendOtp(token);
            res.status(200).json({ success: true, newToken });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            let userCheck = await this.Userusecase.login(email, password);
            console.log(userCheck)
            if (userCheck.success) {
                res.cookie('userToken', userCheck.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                })
                res.status(200).json({ success: true, token: userCheck.token })
            } else {
                res.status(401).json({ success: false, message: userCheck.message })
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' })
        }

    }

    async gsignup(req: Request, res: Response) {
        try {
            console.log('in gsignup')
            const { name, email, password } = req.body;
            const savedUser = await this.Userusecase.gSignup(name, email, password);
            console.log('Saved user...', savedUser);
            if (savedUser.success) {
                res.cookie('userToken', savedUser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                })
                res.status(200).json({ success: true, token: savedUser.token })
            } else {
                res.status(401).json({ message: savedUser.message })
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' })
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
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }
    async editProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const editedData = req.body
            let image = req.file;
            editedData.image = image;
            let filename = req.file?.filename;
            if (userId) {
                let updated = await this.Userusecase.updateProfile(userId, editedData, filename as string);
                if (updated) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(500).json({ success: false, message: 'Not updated!' })
                }
            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error!" })
        }
    }

    async getConversations(req: Request, res: Response) {
        try {
            let id = req.userId;
            if (id) {
                const conversations = await this.Userusecase.getConversations(id);
                res.status(200).json({ success: true, conversations });
            } else {
                res.status(401).json({ success: false, message: 'Internal server error!' });
            }
        } catch (err) {
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
            res.status(500).json({ success: false, message: "Internal server error!" })
        }
    }

    async followProfessional(req: Request, res: Response) {
        try {
            console.log('in follow controller fn')
            let userId = req.userId as string;
            let profId = req.body.profId;

            const followed = await this.Userusecase.followProfessional(profId, userId);
            if (followed) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async unfollowProfessional(req: Request, res: Response) {
        try {
            let userId = req.userId as string;
            let profId = req.body.profId;

            const unfollowed = await this.Userusecase.unfollowProfessional(profId, userId);
            if (unfollowed) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async savePost(req: Request, res: Response) {
        try {
            let userId = req.userId;
            let postId = req.params.id;
            let save = req.params.save;
            let saved = await this.Userusecase.savePost(postId, userId as string, save);
            if (saved) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            let email = req.body.email;
            const data = await this.Userusecase.forgotPassword(email);
            if (!data.data) {
                res.status(402).json({ success: false, message: 'Email not found!' });
            } else {
                res.status(200).json({ success: true, token: data.token });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async verifyOtpForgotPassword(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string;
            let otp = req.body.otp;
            const result = await this.Userusecase.verifyOtpForgotPassword(token, otp);
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(402).json({ success: false, message: 'Incorrect OTP!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string;
            let password = req.body.password;
            const result = await this.Userusecase.changePassword(token, password);
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(402).json({ success: false, message: 'Failed to change the password!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

}

export default UserController;