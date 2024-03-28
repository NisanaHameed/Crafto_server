import Professional from "../domain/professional";
import profRepository from "./interface/IProfInterface";
import GenerateOTP from "../infrastructure/utils/otpGenerator";
import SendMail from "../infrastructure/utils/sendMail";
import HashPassword from "../infrastructure/utils/hashPassword";
import JWT from "../infrastructure/utils/jwt";
import jwt from 'jsonwebtoken';
import Cloudinary from "../infrastructure/utils/cloudinary";

class ProfUsecase {
    private profRepository: profRepository;
    private generateOtp: GenerateOTP;
    private sendMail: SendMail;
    private hash: HashPassword;
    private jwt: JWT;
    private cloudinary: Cloudinary;

    constructor(repo: profRepository, otp: GenerateOTP, mail: SendMail, hash: HashPassword, jwt: JWT, cloudinary: Cloudinary) {
        this.profRepository = repo
        this.generateOtp = otp
        this.sendMail = mail
        this.hash = hash
        this.jwt = jwt
        this.cloudinary = cloudinary
    }
    async findProf(profData: Professional) {
        try {
            let profExist = await this.profRepository.findByEmail(profData.email);
            if (profExist) {
                return { data: true };
            } else {
                const otp = this.generateOtp.generateOtp();
                console.log(otp);
                let token = jwt.sign({ profData, otp }, process.env.auth_secret as string, { expiresIn: '5m' });
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
            let decoded = JWT.verifyToken(token)
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
    async fillProfile(profdata: Professional, token: string) {
        try {
            let decoded = JWT.verifyToken(token);
            if (decoded) {
                let hashedP = await this.hash.hashPassword(decoded.profData.password);
                profdata.email = decoded.profData.email;
                profdata.password = hashedP;

                let uploadFile = await this.cloudinary.uploadToCloud(profdata.image);
                console.log('uploaded file' + uploadFile)
                profdata.image = uploadFile
                let newProf: any = await this.profRepository.saveProfessional(profdata);
                if (newProf) {
                    let token = JWT.generateToken(newProf._id, 'professional');
                    return { success: true, token }
                } else {
                    return { success: false, message: "Internal server error!" }
                }
            } else {
                return { success: false, message: "No token. Try again!" }
            }


        } catch (err) {
            console.log(err);
            throw err;
        }
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
                    let token = JWT.generateToken(profdata._id, 'professional');
                    return { success: true, token: token };
                }
            } else {
                return { success: false, message: "Email not found" }
            }
        } catch (err) {
            console.log(err);
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
                const token = jwt.sign({ profData }, process.env.auth_secret as string, { expiresIn: '15m' });
                return { success: true, token }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getProfile(id: string) {
        try {
            const profdata = await this.profRepository.findProfById(id);
            return profdata;
        } catch (err) {
            console.log(err);
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

    async editEmail(id: string, email: string) {
        try {
            const res = await this.profRepository.updateEmail(id, email);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async editPassword(id: string, cpassword: string, npassword: string) {
        try {
            let profdata = await this.profRepository.findProfById(id);
            if (profdata && profdata.password == cpassword) {
                let res = await this.profRepository.updatePassword(id, npassword);
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
}

export default ProfUsecase;