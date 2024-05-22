import { Request, Response } from 'express'
import Usecase from '../../use_case/profUsecase'
import Subscription from '../../domain/subscription';

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
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string;
            let newToken = await this.usecase.resendOtp(token);
            res.status(200).json({ success: true, newToken });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async fillProfile(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string;
            let data = req.body;
            let image = req.file;
            let filename = req.file?.filename
            console.log('image', image)
            data.image = image;
            let saved = await this.usecase.fillProfile(data, token, filename as string);
            if (saved.success) {
                res.cookie('profToken', saved.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                })
                res.status(200).json({ success: true, token: saved.token })
            } else {
                res.status(401).json({ success: false, message: saved.message });
            }

        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async gsignup(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const savedUser = await this.usecase.gSignup(email, password);
            if (savedUser.success) {
                res.status(200).json({ success: true, token: savedUser.token })
            } else {
                res.status(401).json({ message: savedUser.message })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            let profCheck = await this.usecase.login(email, password);
            if (profCheck.success) {
                res.cookie('profToken', profCheck.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                })
                res.status(200).json({ success: true, token: profCheck.token })
            } else {
                res.status(401).json({ message: profCheck.message })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getProfile(req: Request, res: Response) {
        try {
            const id = req.profId;
            if (id) {
                let profdata = await this.usecase.getProfile(id);
                res.status(200).json({ success: true, profdata })
            } else {
                res.status(401).json({ success: false, message: "Incorrect ID" })
            }
        } catch (err) {
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
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            let email = req.body.email;
            const data = await this.usecase.forgotPassword(email);
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
            const result = await this.usecase.verifyOtpForgotPassword(token, otp);
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
            const result = await this.usecase.changePassword(token, password);
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(402).json({ success: false, message: 'Failed to change the password!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
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
                console.log(profdata);
                res.status(200).json({ success: true, profdata })
            } else {
                res.status(401).json({ success: false, message: "Incorrect ID" })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async savePost(req: Request, res: Response) {
        try {
            let profId = req.profId;
            let postId = req.params.id;
            let save = req.params.save;
            let saved = await this.usecase.savePost(postId, profId as string, save);
            if (saved) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async subscribe(req: Request, res: Response) {
        try {
            let profId = req.profId;
            let plan = req.params.plan;
            console.log('In subscribe controller')
            const stripe = await this.usecase.subscribe(profId as string, plan);
            res.status(200).json({ success: true, stripe });

        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async webhook(req: Request, res: Response) {

        try {
            switch (req.body.type) {
                case 'customer.subscription.created':
                    console.log('subscription', req.body.data.object);

                    const subscription = req.body.data.object;
                    console.log('Amount ', subscription.plan.amount)
                    let planType = '';
                    if (subscription.plan.id == 'price_1P7yVpSCG87ABkwC64tgfuOh') {
                        planType = 'Monthly';
                    } else if (subscription.plan.id == 'price_1P7zsESCG87ABkwCAjgopRuS') {
                        planType = 'Yearly';
                    }
                    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
                    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
                    const data = {
                        subscriptionId: subscription.id,
                        plan: {
                            planType,
                            amount: subscription.plan.amount / 100
                        },
                        startDate: currentPeriodStart,
                        endDate: currentPeriodEnd,
                        createdAt: new Date(subscription.created * 1000),
                        status: 'Active'
                    }
                    console.log('data', data);
                    console.log('metaData', req.body.data.object.metaData);
                    const newSubscription = await this.usecase.createSubscription(data as Subscription);
                    break;
                case 'checkout.session.completed':
                    const session = req.body.data.object;
                    console.log(session);
                    console.log('sessionId', session.id)
                    const subscriptionId = session.subscription;
                    console.log(subscriptionId);
                    const result = await this.usecase.webhook(session.metadata.userId, subscriptionId);
                    break;
                case 'invoice.payment_failed':
                    const failedPaymentInfo = req.body.object;
                    const userId = failedPaymentInfo.metadata.userId;
                    await this.usecase.handlePaymentFailure(userId);
                default:
                    console.log('Unhandled event type');
            }
            res.json({ received: true });
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err}`);
            return;
        }
    }

    async cancelSubscription(req: Request, res: Response) {
        try {
            let profId = req.profId;
            const cancelled = await this.usecase.cancelSubscription(profId as string);
            if (cancelled) {
                res.status(200).json({ success: true, message: 'Internal server error' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
}

export default ProfController;