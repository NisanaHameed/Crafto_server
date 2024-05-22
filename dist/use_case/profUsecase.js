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
class ProfUsecase {
    constructor(repo, otp, mail, hash, jwt, cloudinary, stripe) {
        this.profRepository = repo;
        this.generateOtp = otp;
        this.sendMail = mail;
        this.hash = hash;
        this.jwt = jwt;
        this.cloudinary = cloudinary;
        this.stripe = stripe;
    }
    findProf(profData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profExist = yield this.profRepository.findByEmail(profData.email);
                if (profExist) {
                    return { data: true };
                }
                else {
                    const otp = this.generateOtp.generateOtp();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ profData, otp }, process.env.AUTH_SECRET, { expiresIn: '10m' });
                    yield this.sendMail.sendMail(profData.email, otp);
                    return {
                        data: false,
                        token: token
                    };
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    saveProf(token, profOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                if (decoded) {
                    if (profOtp == decoded.otp) {
                        return { success: true };
                    }
                    else {
                        return { success: false, message: "Incorrect OTP!" };
                    }
                }
                else {
                    return { success: false, message: "No token.Try again!" };
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    resendOtp(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                let newOtp = this.generateOtp.generateOtp();
                console.log(newOtp);
                let profData = decoded.profData;
                let newToken = jsonwebtoken_1.default.sign({ profData, otp: newOtp }, process.env.AUTH_SECRET, { expiresIn: '10m' });
                return newToken;
            }
            catch (err) {
                throw err;
            }
        });
    }
    fillProfile(profdata, token, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                if (decoded) {
                    let hashedP = yield this.hash.hashPassword(decoded.profData.password);
                    profdata.email = decoded.profData.email;
                    profdata.password = hashedP;
                    let uploadFile = yield this.cloudinary.uploadToCloud(profdata.image);
                    this.deleteImageFile(filename);
                    profdata.image = uploadFile;
                    let newProf = yield this.profRepository.saveProfessional(profdata);
                    if (newProf) {
                        let token = this.jwt.generateToken(newProf._id, 'professional');
                        return { success: true, token };
                    }
                    else {
                        return { success: false, message: "Internal server error!" };
                    }
                }
                else {
                    return { success: false, message: "No token. Try again!" };
                }
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
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profdata = yield this.profRepository.findByEmail(email);
                if (profdata) {
                    let checkPassword = yield this.hash.compare(password, profdata.password);
                    if (!checkPassword) {
                        return { success: false, message: "Incorrect Password" };
                    }
                    else if (profdata.isBlocked) {
                        return { success: false, message: "User is blocked" };
                    }
                    else {
                        let token = this.jwt.generateToken(profdata._id, 'professional');
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
    gSignup(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.profRepository.findByEmail(email);
                if (findUser) {
                    return { success: false, message: "Email already exists" };
                }
                else {
                    const profData = { email, password };
                    const token = jsonwebtoken_1.default.sign({ profData }, process.env.AUTH_SECRET, { expiresIn: '15m' });
                    return { success: true, token };
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
                const profdata = yield this.profRepository.findProfById(id);
                return profdata;
            }
            catch (err) {
                throw err;
            }
        });
    }
    editProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.profRepository.updateProfile(id, data);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    editImage(id, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let uploadFile = yield this.cloudinary.uploadToCloud(image);
                const res = yield this.profRepository.updateImage(id, uploadFile);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    editEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profExist = yield this.profRepository.findByEmail(email);
                if (profExist) {
                    return { data: true };
                }
                else {
                    const otp = this.generateOtp.generateOtp();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ email, otp }, process.env.AUTH_SECRET, { expiresIn: '5m' });
                    yield this.sendMail.sendMail(email, otp);
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
    changeEmail_Otp(id, token, enteredeOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = yield this.jwt.verifyToken(token);
                if (decoded) {
                    if (decoded.otp === enteredeOtp) {
                        const res = yield this.profRepository.updateEmail(id, decoded.email);
                        if (res) {
                            return { success: true };
                        }
                        else {
                            return { success: false, message: 'Email is not updated.Try again!' };
                        }
                    }
                    else {
                        return { success: false, message: 'Incorrect OTP!' };
                    }
                }
                else {
                    return { success: false, message: 'Token expired!' };
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    editPassword(id, cpassword, npassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profdata = yield this.profRepository.findProfById(id);
                let hashedCPassword = yield this.hash.compare(cpassword, profdata === null || profdata === void 0 ? void 0 : profdata.password);
                if (profdata && hashedCPassword) {
                    let hashed = yield this.hash.hashPassword(npassword);
                    let res = yield this.profRepository.updatePassword(id, hashed);
                    if (res) {
                        return { success: true };
                    }
                    else {
                        return { success: false, message: 'Password is not edited.Try again!' };
                    }
                }
                else {
                    return { success: false, message: 'Current password is incorrect!' };
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findEmail = yield this.profRepository.findByEmail(email);
                if (!findEmail) {
                    return { data: false };
                }
                else {
                    const otp = this.generateOtp.generateOtp();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ email, otp }, process.env.AUTH_SECRET, { expiresIn: '5m' });
                    yield this.sendMail.sendMail(email, otp);
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
                let decoded = yield jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET);
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
                let decoded = yield this.jwt.verifyToken(token);
                let hashedPassword = yield this.hash.hashPassword(password);
                const result = yield this.profRepository.changePassword(decoded.email, hashedPassword);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    findProfessionals(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.profRepository.findProfessionals(id);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    savePost(postId, profId, save) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saved = yield this.profRepository.savePost(postId, profId, save);
                return saved;
            }
            catch (err) {
                throw err;
            }
        });
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profRepository.createSubscription(data);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    subscribe(profId, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('in stripe usecase');
                const prof = yield this.profRepository.findProfById(profId);
                const stripeRes = yield this.stripe.makePayment(prof.email, plan, profId);
                return stripeRes;
            }
            catch (err) {
                return err;
            }
        });
    }
    webhook(profId, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateSubscription = yield this.profRepository.updateSubscription(profId, subscriptionId);
                const prof = yield this.profRepository.updateProfile(profId, { isVerified: true, subscriptionID: subscriptionId });
                return prof && updateSubscription;
            }
            catch (err) {
                throw err;
            }
        });
    }
    cancelSubscription(profId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateSubscription = yield this.profRepository.updateSubscription(profId, '');
                const prof = yield this.profRepository.findProfById(profId);
                yield this.stripe.cancelSubscription(prof === null || prof === void 0 ? void 0 : prof.subscriptionID);
                const updated = yield this.profRepository.updateIsVerified(profId, false);
                return updated;
            }
            catch (err) {
                throw err;
            }
        });
    }
    handlePaymentFailure(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield this.profRepository.updateIsVerified(id, false);
                return updated;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = ProfUsecase;
