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
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor(Userusecase) {
        this.Userusecase = Userusecase;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                console.log(name, '+', email);
                const userData = { name, email, password };
                let userCheck = yield this.Userusecase.findUser(userData);
                console.log(userCheck);
                if (!userCheck.data) {
                    const token = userCheck === null || userCheck === void 0 ? void 0 : userCheck.token;
                    console.log(userCheck === null || userCheck === void 0 ? void 0 : userCheck.token);
                    res.status(200).json({ success: true, token });
                }
                else {
                    res.send(409).json({ success: false, message: "Email already exists" });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let userOtp = req.body.otp;
                let saveduser = yield this.Userusecase.saveUSer(token, userOtp);
                if (saveduser.success) {
                    res.cookie('userToken', saveduser.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true
                    });
                    res.status(200).json(saveduser);
                }
                else {
                    res.status(402).json({ success: false, message: saveduser.message });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let newToken = yield this.Userusecase.resendOtp(token);
                res.status(200).json({ success: true, newToken });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                let userCheck = yield this.Userusecase.login(email, password);
                console.log(userCheck);
                if (userCheck.success) {
                    res.cookie('userToken', userCheck.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true
                    });
                    res.status(200).json({ success: true, token: userCheck.token });
                }
                else {
                    res.status(401).json({ success: false, message: userCheck.message });
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    gsignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('in gsignup');
                const { name, email, password } = req.body;
                const savedUser = yield this.Userusecase.gSignup(name, email, password);
                console.log('Saved user...', savedUser);
                if (savedUser.success) {
                    res.cookie('userToken', savedUser.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true
                    });
                    res.status(200).json({ success: true, token: savedUser.token });
                }
                else {
                    res.status(401).json({ message: savedUser.message });
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    let userdata = yield this.Userusecase.getProfile(userId);
                    res.status(200).json({ success: true, userdata });
                }
                else {
                    res.status(401).json({ success: false, message: "UserId is not found" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.userId;
                const editedData = req.body;
                let image = req.file;
                editedData.image = image;
                let filename = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                if (userId) {
                    let updated = yield this.Userusecase.updateProfile(userId, editedData, filename);
                    if (updated) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Not updated!' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: "Something went wrong!Try again!" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error!" });
            }
        });
    }
    getConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.userId;
                if (id) {
                    const conversations = yield this.Userusecase.getConversations(id);
                    res.status(200).json({ success: true, conversations });
                }
                else {
                    res.status(401).json({ success: false, message: 'Internal server error!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error!" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('userToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true });
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error!" });
            }
        });
    }
    followProfessional(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('in follow controller fn');
                let userId = req.userId;
                let profId = req.body.profId;
                const followed = yield this.Userusecase.followProfessional(profId, userId);
                if (followed) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    unfollowProfessional(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.userId;
                let profId = req.body.profId;
                const unfollowed = yield this.Userusecase.unfollowProfessional(profId, userId);
                if (unfollowed) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.userId;
                let postId = req.params.id;
                let save = req.params.save;
                let saved = yield this.Userusecase.savePost(postId, userId, save);
                if (saved) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email = req.body.email;
                const data = yield this.Userusecase.forgotPassword(email);
                if (!data.data) {
                    res.status(402).json({ success: false, message: 'Email not found!' });
                }
                else {
                    res.status(200).json({ success: true, token: data.token });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    verifyOtpForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let otp = req.body.otp;
                const result = yield this.Userusecase.verifyOtpForgotPassword(token, otp);
                if (result) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(402).json({ success: false, message: 'Incorrect OTP!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let password = req.body.password;
                const result = yield this.Userusecase.changePassword(token, password);
                if (result) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to change the password!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
}
exports.default = UserController;
