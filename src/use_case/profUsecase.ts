import Professional from "../domain/professional";
import profRepository from "./interface/IProfInterface";
import GenerateOTP from "../infrastructure/utils/otpGenerator";
import SendMail from "../infrastructure/utils/sendMail";
import HashPassword from "../infrastructure/utils/hashPassword";
import JWT from "../infrastructure/utils/jwt";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Cloudinary from "../infrastructure/utils/cloudinary";
import StripePayment from "../infrastructure/utils/stripe";
import Subscription from "../domain/subscription";
import { unlink } from 'fs';
import { join } from 'path';

class ProfUsecase {
    private profRepository: profRepository;
    private generateOtp: GenerateOTP;
    private sendMail: SendMail;
    private hash: HashPassword;
    private jwt: JWT;
    private cloudinary: Cloudinary;
    private stripe: StripePayment

    constructor(repo: profRepository, otp: GenerateOTP, mail: SendMail, hash: HashPassword, jwt: JWT, cloudinary: Cloudinary, stripe: StripePayment) {
        this.profRepository = repo
        this.generateOtp = otp
        this.sendMail = mail
        this.hash = hash
        this.jwt = jwt
        this.cloudinary = cloudinary
        this.stripe = stripe;
    }
    async findProf(profData: Professional) {
        try {
            let profExist = await this.profRepository.findByEmail(profData.email);
            if (profExist) {
                return { data: true };
            } else {
                const otp = this.generateOtp.generateOtp();
                console.log(otp);
                let token = jwt.sign({ profData, otp }, process.env.AUTH_SECRET as string, { expiresIn: '10m' });
                await this.sendMail.sendMail(profData.email, otp);
                return {
                    data: false,
                    token: token
                }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async saveProf(token: string, profOtp: string) {
        try {
            let decoded = this.jwt.verifyToken(token)
            if (decoded) {
                if (profOtp == decoded.otp) {
                    return { success: true };
                } else {
                    return { success: false, message: "Incorrect OTP!" }
                }
            } else {
                return { success: false, message: "No token.Try again!" }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async resendOtp(token: string) {
        try {
            let decoded = this.jwt.verifyToken(token) as JwtPayload;
            let newOtp = this.generateOtp.generateOtp();
            console.log(newOtp);
            let profData = decoded.profData
            let newToken = jwt.sign({ profData, otp: newOtp }, process.env.AUTH_SECRET as string, { expiresIn: '10m' })
            return newToken;
        } catch (err) {
            throw err;
        }
    }

    async fillProfile(profdata: Professional, token: string, filename: string) {
        try {
            let decoded = this.jwt.verifyToken(token);
            if (decoded) {
                let hashedP = await this.hash.hashPassword(decoded.profData.password);
                profdata.email = decoded.profData.email;
                profdata.password = hashedP;
                let uploadFile = await this.cloudinary.uploadToCloud(profdata.image);
                this.deleteImageFile(filename);
                profdata.image = uploadFile
                let newProf: any = await this.profRepository.saveProfessional(profdata);
                if (newProf) {
                    let token = this.jwt.generateToken(newProf._id, 'professional');
                    return { success: true, token }
                } else {
                    return { success: false, message: "Internal server error!" }
                }
            } else {
                return { success: false, message: "No token. Try again!" }
            }


        } catch (err) {
            throw err;
        }
    }

    async deleteImageFile(filename: any) {
        const imagePath = join(__dirname, '../infrastructure/public/images', filename);
        unlink(imagePath, (err: any) => {
            if (err) {
                console.log("Error deleting image.." + err);
            } else {
                console.log('image deleted');
            }
        })
    }

    async login(email: string, password: string) {
        try {
            let profdata: any = await this.profRepository.findByEmail(email);
            if (profdata) {

                let checkPassword = await this.hash.compare(password, profdata.password);
                if (!checkPassword) {
                    return { success: false, message: "Incorrect Password" }
                } else if (profdata.isBlocked) {
                    return { success: false, message: "User is blocked" }
                } else {
                    let token = this.jwt.generateToken(profdata._id, 'professional');
                    return { success: true, token: token };
                }
            } else {
                return { success: false, message: "Email not found" }
            }
        } catch (err) {
            throw err;
        }
    }

    async gSignup(email: string, password: string) {
        try {
            const findUser = await this.profRepository.findByEmail(email);
            if (findUser) {
                return { success: false, message: "Email already exists" }
            } else {
                const profData = { email, password }
                const token = jwt.sign({ profData }, process.env.AUTH_SECRET as string, { expiresIn: '15m' });
                return { success: true, token }
            }
        } catch (err) {
            throw err;
        }
    }

    async getProfile(id: string) {
        try {
            const profdata = await this.profRepository.findProfById(id);
            return profdata;
        } catch (err) {
            throw err;
        }
    }
    async editProfile(id: string, data: Professional) {
        try {
            let res = await this.profRepository.updateProfile(id, data);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async editImage(id: string, image: Express.Multer.File) {
        try {
            let uploadFile = await this.cloudinary.uploadToCloud(image);
            const res = await this.profRepository.updateImage(id, uploadFile);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async editEmail(email: string) {
        try {
            let profExist = await this.profRepository.findByEmail(email);
            if (profExist) {
                return { data: true };
            } else {
                const otp = this.generateOtp.generateOtp();
                console.log(otp);
                let token = jwt.sign({ email, otp }, process.env.AUTH_SECRET as string, { expiresIn: '5m' });
                await this.sendMail.sendMail(email, otp);
                return {
                    data: false,
                    token: token
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async changeEmail_Otp(id: string, token: string, enteredeOtp: string) {
        try {
            let decoded = await this.jwt.verifyToken(token);
            if (decoded) {
                if (decoded.otp === enteredeOtp) {
                    const res = await this.profRepository.updateEmail(id, decoded.email);
                    if (res) {
                        return { success: true };
                    } else {
                        return { success: false, message: 'Email is not updated.Try again!' }
                    }
                } else {
                    return { success: false, message: 'Incorrect OTP!' }
                }
            } else {
                return { success: false, message: 'Token expired!' }
            }
        } catch (err) {
            throw err;
        }
    }

    async editPassword(id: string, cpassword: string, npassword: string) {
        try {
            let profdata = await this.profRepository.findProfById(id);
            let hashedCPassword = await this.hash.compare(cpassword, profdata?.password as string)
            if (profdata && hashedCPassword) {
                let hashed = await this.hash.hashPassword(npassword)
                let res = await this.profRepository.updatePassword(id, hashed);
                if (res) {
                    return { success: true };
                } else {
                    return { success: false, message: 'Password is not edited.Try again!' }
                }

            } else {
                return { success: false, message: 'Current password is incorrect!' }
            }
        } catch (err) {
            throw err;
        }
    }

    async forgotPassword(email: string) {
        try {
            const findEmail = await this.profRepository.findByEmail(email);
            if (!findEmail) {
                return { data: false }
            } else {
                const otp = this.generateOtp.generateOtp();
                console.log(otp);
                let token = jwt.sign({ email, otp }, process.env.AUTH_SECRET as string, { expiresIn: '5m' });
                await this.sendMail.sendMail(email, otp);
                return { data: true, token };
            }
        } catch (err) {
            throw err;
        }
    }

    async verifyOtpForgotPassword(token: string, otp: string) {
        try {
            let decoded = await jwt.verify(token, process.env.AUTH_SECRET as string) as JwtPayload;
            if (decoded.otp !== otp) {
                return false
            } else {
                return true;
            }
        } catch (err) {
            throw err;
        }
    }

    async changePassword(token: string, password: string) {
        try {
            let decoded = await this.jwt.verifyToken(token) as JwtPayload;
            let hashedPassword = await this.hash.hashPassword(password);
            const result = await this.profRepository.changePassword(decoded.email, hashedPassword);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findProfessionals(id: string) {
        try {
            let res = await this.profRepository.findProfessionals(id);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async savePost(postId: string, profId: string, save: string) {
        try {
            const saved = await this.profRepository.savePost(postId, profId, save);
            return saved;
        } catch (err) {
            throw err;
        }
    }

    async createSubscription(data: Subscription) {
        try {
            const result = await this.profRepository.createSubscription(data);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async subscribe(profId: string, plan: string) {
        try {
            console.log('in stripe usecase')

            const prof: any = await this.profRepository.findProfById(profId);
            const stripeRes = await this.stripe.makePayment(prof.email, plan, profId);
            return stripeRes;
        } catch (err) {
            return err;
        }
    }

    async webhook(profId: string, subscriptionId: string) {
        try {
            const updateSubscription = await this.profRepository.updateSubscription(profId, subscriptionId);
            const prof = await this.profRepository.updateProfile(profId, { isVerified: true, subscriptionID: subscriptionId } as Professional);
            return prof && updateSubscription;
        } catch (err) {
            throw err;
        }
    }

    async cancelSubscription(profId: string) {
        try {
            const updateSubscription = await this.profRepository.updateSubscription(profId, '');
            const prof: any = await this.profRepository.findProfById(profId);
            await this.stripe.cancelSubscription(prof?.subscriptionID);
            const updated = await this.profRepository.updateIsVerified(profId, false);
            return updated;
        } catch (err) {
            throw err;
        }
    }

    async handlePaymentFailure(id: string) {
        try {
            const updated = await this.profRepository.updateIsVerified(id, false);
            return updated;
        } catch (err) {
            throw err;
        }
    }

}

export default ProfUsecase;