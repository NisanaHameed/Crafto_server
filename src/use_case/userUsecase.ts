import User from '../domain/user';
import userRepository from './interface/userInterface';
import SendOTP from '../infrastructure/utils/sendMail';
import GenerateOTP from '../infrastructure/utils/otpGenerator';
import HashPassword from '../infrastructure/utils/hashPassword';
import JWT from '../infrastructure/utils/jwt';

class Userusecase {
    private userRepository: userRepository;
    private GenerateOTP;
    private sendOtp;
    private hash;
    constructor(userRpository: userRepository, GenerateOTP: GenerateOTP, sendOtp: SendOTP, hash: HashPassword, jwt: JWT) {
        this.userRepository = userRpository;
        this.GenerateOTP = GenerateOTP;
        this.sendOtp = sendOtp;
        this.hash = hash;
    }
    async findUser(email: string) {
        try {
            let userExist = await this.userRepository.findByEmail(email)
            if (userExist) {
                return { data: true }
            } else {
                const otp = this.GenerateOTP.generateOtp();
                await this.sendOtp.sendMail(email, otp)
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
    async saveUSer(user: User) {
        try {
            let hashedP = await this.hash.hashPassword(user.password)
            user.password = hashedP;
            let newUser = await this.userRepository.saveUser(user);
            return newUser;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async login(email: string, password: string) {
        try {
            let userdata: any = await this.userRepository.findByEmail(email);
            if (userdata) {
                if (userdata.isBlocked) {
                    return { success: false, message: "User is blocked" }
                }
                let checkPassword = await this.hash.compare(password, userdata.password);
                if (!checkPassword) {
                    return { success: false, message: "Incorrect password" }
                } else {
                    let token = JWT.generateToken(userdata._id, 'user');
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
            const userdata = await this.userRepository.findUserById(id);
            return userdata;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async updateProfile(id:string,editedData:User){
        try{
            let checkEmail = await this.userRepository.findUserById(id);
            if(checkEmail?.email!==editedData.email){
                let userExist = await this.userRepository.findByEmail(editedData.email);
                if(userExist){
                    return {success:false,message:"Email already exists"}
                }else{
                    const otp = this.GenerateOTP.generateOtp();
                    let sendMail = await this.sendOtp.sendMail(editedData.email,otp);
                }
            }
        }catch(err){
            console.log(err);
            throw err;
        }
    }
}
export default Userusecase;