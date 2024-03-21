import User from '../domain/user';
import IUserInterface from './interface/IUserInterface';
import SendOTP from '../infrastructure/utils/sendMail';
import GenerateOTP from '../infrastructure/utils/otpGenerator';
import HashPassword from '../infrastructure/utils/hashPassword';
import JWT from '../infrastructure/utils/jwt';

class Userusecase {

    private userRepository: IUserInterface;
    private GenerateOTP: GenerateOTP;
    private sendOtp: SendOTP;
    private hash: HashPassword;

    constructor(userRpository: IUserInterface, GenerateOTP: GenerateOTP, sendOtp: SendOTP, hash: HashPassword, jwt: JWT) {
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
            let newUser: any = await this.userRepository.saveUser(user);
            if (newUser) {
                let token = JWT.generateToken(newUser._id, 'user');
                return { success: true, token };
            } else {
                return { success: false }
            }
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
                let checkPassword = await this.hash.compare(password, userdata.password);
                if (!checkPassword) {
                    return { success: false, message: "Incorrect password" }
                } else if (userdata.isBlocked) {
                    return { success: false, message: "User is blocked by admin!" }
                }
                else {
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

    async gSignup(name: string, email: string, password: string) {
        try {
            const findUser = await this.userRepository.findByEmail(email);
            if (findUser) {
                return { success: false, message: "Email already exists" }
            } else {
                const hashedPassword = await this.hash.hashPassword(password);
                const savedUser: any = await this.userRepository.saveUser({ name, email, password: hashedPassword } as User);
                if (savedUser) {
                    const token = JWT.generateToken(savedUser._id, 'user');
                    return { success: true, token }
                } else {
                    return { success: false, message: "Internal server error" }
                }
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
    async updateProfile(id: string, editedData: User) {
        try {
            let checkEmail = await this.userRepository.findUserById(id);
            if (checkEmail?.email !== editedData.email) {
                let userExist = await this.userRepository.findByEmail(editedData.email);
                if (userExist) {
                    return { success: false, message: "Email already exists" }
                } else {
                    const otp = this.GenerateOTP.generateOtp();
                    let sendMail = await this.sendOtp.sendMail(editedData.email, otp);
                }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
export default Userusecase;