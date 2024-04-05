import { Request, Response } from 'express'
import Usecase from '../../use_case/profUsecase'

class ProfController {
    private usecase;
    constructor(usecase: Usecase) {
        this.usecase = usecase;
    }
    async signup(req: Request, res: Response) {
        try {
            const profData = req.body;
            let profCheck = await this.usecase.findProf(profData);
            if (!profCheck.data) {
                const token = profCheck?.token;
                res.status(200).json({ success: true, token });
            } else {
                res.status(409).json({ success: false, message: "Email already exists" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async verifyOTP(req: Request, res: Response) {
        try {

            let token = req.headers.authorization?.split(' ')[1] as string;
            let profOtp = req.body.otp;
            let savedProf = await this.usecase.saveProf(token, profOtp);
            if (savedProf.success) {
                res.status(200).json({ success: true });
            } else {
                res.status(402).json({ success: false, message: savedProf.message })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async fillProfile(req: Request, res: Response) {
        try {
            console.log('In fillProfile controller');
            let token = req.headers.authorization?.split(' ')[1] as string;
            let data = req.body;
            let image = req.file;
            data.image = image;
            let saved = await this.usecase.fillProfile(data, token);
            if (saved.success) {
                res.cookie('profToken', saved.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json({ success: true, token: saved.token })
            } else {
                res.status(401).json({ success: false, message: saved.message });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async gsignup(req: Request, res: Response) {
        try {
            console.log('in gsignup')
            const { email, password } = req.body;
            const savedUser = await this.usecase.gSignup(email, password);
            if (savedUser.success) {
                res.status(200).json({ success: true, token: savedUser.token })
            } else {
                res.status(401).json({ message: savedUser.message })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            let profCheck = await this.usecase.login(email, password);
            if (profCheck.success) {
                res.cookie('profToken', profCheck.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json({ success: true, token: profCheck.token })
            } else {
                res.status(401).json({ message: profCheck.message })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getProfile(req: Request, res: Response) {
        try {
            const id = req.profId;
            console.log('id' + id)
            if (id) {
                let profdata = await this.usecase.getProfile(id);
                res.status(200).json({ success: true, profdata })
            } else {
                res.status(401).json({ success: false, message: "Incorrect ID" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async editProfile(req: Request, res: Response) {
        try {
            let id = req.profId;
            let editedData = req.body;
            if (id) {
                let edited = await this.usecase.editProfile(id, editedData);
                if (edited) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(500).json({ success: false, message: 'Profile is not updated' })
                }
            } else {
                res.status(401).json({ success: false, message: 'No token!Please login' })
            }

        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async editImage(req: Request, res: Response) {
        try {
            let id = req.profId;
            let image = req.file;
            if (id && image) {
                let edited = await this.usecase.editImage(id, image);
                if (edited) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(500).json({ success: false, message: 'Image is not updated' })
                }
            } else {
                res.status(401).json({ success: false, message: 'No token!Please login' })
            }

        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async editEmail(req: Request, res: Response) {
        try {
            let email = req.body.email
            let edited = await this.usecase.editEmail(email);
            if (!edited.data) {
                res.status(200).json({ success: true, token: edited.token });
            } else {
                res.status(401).json({ success: false, message: 'Email already exists!' })
            }

        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async changeEmail_Otp(req: Request, res: Response) {
        try {
            let id = req.profId;
            let enteredeOtp = req.body.otp;
            console.log(id, enteredeOtp)
            let token = req.headers.authorization?.split(' ')[1] as string;
            if (id) {
                let result = await this.usecase.changeEmail_Otp(id, token, enteredeOtp);
                if (result.success) {
                    res.status(200).json({ success: true });
                } else {
                    console.log('error happened')
                    console.log(result.message);
                    res.status(401).json({ success: false, message: result.message })
                }
            } else {
                res.status(401).json({ success: false, message: 'No token!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async editPassword(req: Request, res: Response) {
        try {
            let id = req.profId;
            let cpassword = req.body.currentPassword;
            let npassword = req.body.newPassword;
            if (id) {
                let edited = await this.usecase.editPassword(id, cpassword, npassword);
                if (edited.success) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(401).json({ success: false, message: edited.message });
                }
            } else {
                res.status(401).json({ success: false, message: 'No token!Please login' })
            }

        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('profToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err);

        }
    }

    async getProfessionals(req: Request, res: Response) {
        try {
            let id = req.profId;
            if (id) {
                let profs = await this.usecase.findProfessionals(id);
                res.status(200).json({ success: true, profs });
            } else {
                res.status(500).json({ success: false, message: 'Failed to fetch data!' });
            }

        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async getAProfessional(req: Request, res: Response) {
        let id = req.params.id;
        try {
            if (id) {
                let profdata = await this.usecase.getProfile(id);
                res.status(200).json({ success: true, profdata })
            } else {
                res.status(401).json({ success: false, message: "Incorrect ID" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export default ProfController;