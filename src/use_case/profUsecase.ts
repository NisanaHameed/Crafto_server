import Professional from "../domain/professional";
import profRepository from "./interface/IProfInterface";
import GenerateOTP from "../infrastructure/utils/otpGenerator";
import SendMail from "../infrastructure/utils/sendMail";
import HashPassword from "../infrastructure/utils/hashPassword";
import JWT from "../infrastructure/utils/jwt";

class ProfUsecase {
    private profRepository: profRepository;
    private generateOtp: GenerateOTP;
    private sendMail: SendMail;
    private hash: HashPassword;
    private jwt: JWT;

    constructor(repo: profRepository, otp: GenerateOTP, mail: SendMail, hash: HashPassword, jwt: JWT) {
        this.profRepository = repo,
            this.generateOtp = otp,
            this.sendMail = mail,
            this.hash = hash,
            this.jwt = jwt
    }
    async findProf(email: string) {
        try {
            let profExist = await this.profRepository.findByEmail(email);
            if (profExist) {
                return { data: true };
            } else {
                const otp = this.generateOtp.generateOtp();
                await this.sendMail.sendMail(email, otp);
                return {
                    data: false,
                    otp: otp
                }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async saveProf(prof: Professional) {
        try {
            let hashedP = await this.hash.hashPassword(prof.password);
            prof.password = hashedP;
            let newProf: any = await this.profRepository.saveProfessional(prof);
            console.log('savedP' + newProf);
            if (newProf) {
                let token = JWT.generateToken(newProf._id, 'professional');
                return { success: true, token }
            } else {
                return { success: false }
            }
            return newProf;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async fillProfile(id: string, profdata: Professional) {
        try {
            let saved = await this.profRepository.updateProfile(id, profdata);
            return saved
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
                }else if (profdata.isBlocked) {
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
    async getProfile(id: string) {
        try {
            const profdata = await this.profRepository.findProfById(id);
            return profdata;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export default ProfUsecase;