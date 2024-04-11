import User from '../domain/user';
import IUserInterface from './interface/IUserInterface';
import SendOTP from '../infrastructure/utils/sendMail';
import GenerateOTP from '../infrastructure/utils/otpGenerator';
import HashPassword from '../infrastructure/utils/hashPassword';
import JWT from '../infrastructure/utils/jwt';
import jwt from 'jsonwebtoken'
import Cloudinary from '../infrastructure/utils/cloudinary';
import ConversationRepository from '../infrastructure/repository/conversationRepository';

class Userusecase {

    private userRepository: IUserInterface;
    private GenerateOTP: GenerateOTP;
    private sendOtp: SendOTP;
    private hash: HashPassword;
    private cloudinary: Cloudinary
    private jwt: JWT;
    private conversation: ConversationRepository

    constructor(userRpository: IUserInterface, GenerateOTP: GenerateOTP, sendOtp: SendOTP, hash: HashPassword, jwt: JWT, Cloudinary: Cloudinary, conversation: ConversationRepository) {
        this.userRepository = userRpository;
        this.GenerateOTP = GenerateOTP;
        this.sendOtp = sendOtp;
        this.hash = hash;
        this.cloudinary = Cloudinary;
        this.jwt = jwt;
        this.conversation = conversation;
    }
    async findUser(userData: User) {
        try {
            let userExist = await this.userRepository.findByEmail(userData.email)
            if (userExist) {
                return { data: true }
            } else {
                const otp = this.GenerateOTP.generateOtp();
                console.log(otp);
                let token = jwt.sign({ userData, otp }, process.env.auth_secret as string, { expiresIn: '5m' });
                await this.sendOtp.sendMail(userData.email, otp)
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
    async saveUSer(token: string, userOtp: string) {
        try {
            let decoded = this.jwt.verifyToken(token)
            if (decoded) {
                if (userOtp == decoded.otp) {
                    let hashedP = await this.hash.hashPassword(decoded.userData.password)
                    decoded.userData.password = hashedP;
                    let newUser: any = await this.userRepository.saveUser(decoded.userData);
                    if (newUser) {
                        let token = this.jwt.generateToken(newUser._id, 'user');
                        return { success: true, token };
                    } else {
                        return { success: false, message: "Internal server error!" }
                    }
                } else {
                    return { success: false, message: "Incorrect OTP!" }
                }
            } else {
                return { success: false, message: "No token!Try again!" }
            }

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
                    let token = this.jwt.generateToken(userdata._id, 'user');
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
                    const token = this.jwt.generateToken(savedUser._id, 'user');
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
            }
            let uploadFile = await this.cloudinary.uploadToCloud(editedData.image);
            editedData.image = uploadFile;
            let res = await this.userRepository.updateUser(id, editedData);
            return res;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getConversations(id: string) {
        try {
            const conversations = await this.conversation.getConversations(id);
            return conversations;
        } catch (err) {
            throw err;
        }
    }

    async followProfessional(profId: string, userId: string) {
        try {
            const followed = await this.userRepository.followProfessional(profId, userId);
            return followed;
        } catch (err) {
            throw err;
        }
    }

    async unfollowProfessional(profId: string, userId: string) {
        try {
            const unfollowed = await this.userRepository.unfollowProf(profId, userId);
            return unfollowed;
        } catch (err) {
            throw err;
        }
    }
}
export default Userusecase;