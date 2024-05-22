"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = require("fs");
const path_1 = require("path");
class Userusecase {
    constructor(userRpository, GenerateOTP, sendOtp, hash, jwt, Cloudinary, conversation) {
        this.userRepository = userRpository;
        this.GenerateOTP = GenerateOTP;
        this.sendOtp = sendOtp;
        this.hash = hash;
        this.cloudinary = Cloudinary;
        this.jwt = jwt;
        this.conversation = conversation;
    }
    findUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userExist = yield this.userRepository.findByEmail(userData.email);
                if (userExist) {
                    return { data: true };
                }
                else {
                    const otp = this.GenerateOTP.generateOtp();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ userData, otp }, process.env.AUTH_SECRET, { expiresIn: '5m' });
                    yield this.sendOtp.sendMail(userData.email, otp);
                    return {
                        data: false,
                        token: token
                    };
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    saveUSer(token, userOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                if (decoded) {
                    if (userOtp == decoded.otp) {
                        let hashedP = yield this.hash.hashPassword(decoded.userData.password);
                        decoded.userData.password = hashedP;
                        let newUser = yield this.userRepository.saveUser(decoded.userData);
                        if (newUser) {
                            let token = this.jwt.generateToken(newUser._id, 'user');
                            return { success: true, token };
                        }
                        else {
                            return { success: false, message: "Internal server error!" };
                        }
                    }
                    else {
                        return { success: false, message: "Incorrect OTP!" };
                    }
                }
                else {
                    return { success: false, message: "No token!Try again!" };
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    resendOtp(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                let newOtp = this.GenerateOTP.generateOtp();
                console.log(newOtp);
                let userData = decoded.userData;
                let newToken = jsonwebtoken_1.default.sign({ userData, otp: newOtp }, process.env.AUTH_SECRET, { expiresIn: '5m' });
                return newToken;
            }
            catch (err) {
                throw err;
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userdata = yield this.userRepository.findByEmail(email);
                if (userdata) {
                    let checkPassword = yield this.hash.compare(password, userdata.password);
                    if (!checkPassword) {
                        return { success: false, message: "Incorrect password" };
                    }
                    else if (userdata.isBlocked) {
                        return { success: false, message: "User is blocked by admin!" };
                    }
                    else {
                        let token = this.jwt.generateToken(userdata._id, 'user');
                        return { success: true, token: token };
                    }
                }
                else {
                    return { success: false, message: "Email not found" };
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    gSignup(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.userRepository.findByEmail(email);
                if (findUser) {
                    return { success: false, message: "Email already exists" };
                }
                else {
                    const hashedPassword = yield this.hash.hashPassword(password);
                    const savedUser = yield this.userRepository.saveUser({ name, email, password: hashedPassword });
                    if (savedUser) {
                        const token = this.jwt.generateToken(savedUser._id, 'user');
                        return { success: true, token };
                    }
                    else {
                        return { success: false, message: "Internal server error" };
                    }
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userdata = yield this.userRepository.findUserById(id);
                return userdata;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateProfile(id, editedData, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let checkEmail = yield this.userRepository.findUserById(id);
                if ((checkEmail === null || checkEmail === void 0 ? void 0 : checkEmail.email) !== editedData.email) {
                }
                let uploadFile = yield this.cloudinary.uploadToCloud(editedData.image);
                editedData.image = uploadFile;
                this.deleteImageFile(filename);
                let res = yield this.userRepository.updateUser(id, editedData);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteImageFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagePath = (0, path_1.join)(__dirname, '../infrastructure/public/images', filename);
            (0, fs_1.unlink)(imagePath, (err) => {
                if (err) {
                    console.log("Error deleting image.." + err);
                }
                else {
                    console.log('image deleted');
                }
            });
        });
    }
    getConversations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield this.conversation.getConversations(id);
                return conversations;
            }
            catch (err) {
                throw err;
            }
        });
    }
    followProfessional(profId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followed = yield this.userRepository.followProfessional(profId, userId);
                return followed;
            }
            catch (err) {
                throw err;
            }
        });
    }
    unfollowProfessional(profId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unfollowed = yield this.userRepository.unfollowProf(profId, userId);
                return unfollowed;
            }
            catch (err) {
                throw err;
            }
        });
    }
    savePost(postId, userId, save) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saved = yield this.userRepository.savePost(postId, userId, save);
                return saved;
            }
            catch (err) {
                throw err;
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findEmail = yield this.userRepository.findByEmail(email);
                if (!findEmail) {
                    return { data: false };
                }
                else {
                    const otp = this.GenerateOTP.generateOtp();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ email, otp }, process.env.AUTH_SECRET, { expiresIn: '5m' });
                    yield this.sendOtp.sendMail(email, otp);
                    return { data: true, token };
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    verifyOtpForgotPassword(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('In verifyOtpForgotPassword usecase');
                let decoded = this.jwt.verifyToken(token);
                if (decoded.otp !== otp) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    changePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                let hasedPassword = yield this.hash.hashPassword(password);
                const result = yield this.userRepository.changePassword(decoded.email, hasedPassword);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = Userusecase;
