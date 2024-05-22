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
class ProfController {
    constructor(usecase) {
        this.usecase = usecase;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profData = req.body;
                let profCheck = yield this.usecase.findProf(profData);
                if (!profCheck.data) {
                    const token = profCheck === null || profCheck === void 0 ? void 0 : profCheck.token;
                    res.status(200).json({ success: true, token });
                }
                else {
                    res.status(409).json({ success: false, message: "Email already exists" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let profOtp = req.body.otp;
                let savedProf = yield this.usecase.saveProf(token, profOtp);
                if (savedProf.success) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(402).json({ success: false, message: savedProf.message });
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
                let newToken = yield this.usecase.resendOtp(token);
                res.status(200).json({ success: true, newToken });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    fillProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let data = req.body;
                let image = req.file;
                let filename = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
                console.log('image', image);
                data.image = image;
                let saved = yield this.usecase.fillProfile(data, token, filename);
                if (saved.success) {
                    res.cookie('profToken', saved.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true
                    });
                    res.status(200).json({ success: true, token: saved.token });
                }
                else {
                    res.status(401).json({ success: false, message: saved.message });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    gsignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const savedUser = yield this.usecase.gSignup(email, password);
                if (savedUser.success) {
                    res.status(200).json({ success: true, token: savedUser.token });
                }
                else {
                    res.status(401).json({ message: savedUser.message });
                }
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
                let profCheck = yield this.usecase.login(email, password);
                if (profCheck.success) {
                    res.cookie('profToken', profCheck.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true
                    });
                    res.status(200).json({ success: true, token: profCheck.token });
                }
                else {
                    res.status(401).json({ message: profCheck.message });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.profId;
                if (id) {
                    let profdata = yield this.usecase.getProfile(id);
                    res.status(200).json({ success: true, profdata });
                }
                else {
                    res.status(401).json({ success: false, message: "Incorrect ID" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.profId;
                let editedData = req.body;
                if (id) {
                    let edited = yield this.usecase.editProfile(id, editedData);
                    if (edited) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Profile is not updated' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'No token!Please login' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.profId;
                let image = req.file;
                if (id && image) {
                    let edited = yield this.usecase.editImage(id, image);
                    if (edited) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Image is not updated' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'No token!Please login' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email = req.body.email;
                let edited = yield this.usecase.editEmail(email);
                if (!edited.data) {
                    res.status(200).json({ success: true, token: edited.token });
                }
                else {
                    res.status(401).json({ success: false, message: 'Email already exists!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    changeEmail_Otp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let id = req.profId;
                let enteredeOtp = req.body.otp;
                console.log(id, enteredeOtp);
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (id) {
                    let result = yield this.usecase.changeEmail_Otp(id, token, enteredeOtp);
                    if (result.success) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        console.log('error happened');
                        console.log(result.message);
                        res.status(401).json({ success: false, message: result.message });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'No token!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.profId;
                let cpassword = req.body.currentPassword;
                let npassword = req.body.newPassword;
                if (id) {
                    let edited = yield this.usecase.editPassword(id, cpassword, npassword);
                    if (edited.success) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(401).json({ success: false, message: edited.message });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'No token!Please login' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('profToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true });
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email = req.body.email;
                const data = yield this.usecase.forgotPassword(email);
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
                const result = yield this.usecase.verifyOtpForgotPassword(token, otp);
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
                const result = yield this.usecase.changePassword(token, password);
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
    getProfessionals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.profId;
                if (id) {
                    let profs = yield this.usecase.findProfessionals(id);
                    res.status(200).json({ success: true, profs });
                }
                else {
                    res.status(500).json({ success: false, message: 'Failed to fetch data!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    getAProfessional(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            try {
                if (id) {
                    let profdata = yield this.usecase.getProfile(id);
                    console.log(profdata);
                    res.status(200).json({ success: true, profdata });
                }
                else {
                    res.status(401).json({ success: false, message: "Incorrect ID" });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profId = req.profId;
                let postId = req.params.id;
                let save = req.params.save;
                let saved = yield this.usecase.savePost(postId, profId, save);
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
    subscribe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profId = req.profId;
                let plan = req.params.plan;
                console.log('In subscribe controller');
                const stripe = yield this.usecase.subscribe(profId, plan);
                res.status(200).json({ success: true, stripe });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    webhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (req.body.type) {
                    case 'customer.subscription.created':
                        console.log('subscription', req.body.data.object);
                        const subscription = req.body.data.object;
                        console.log('Amount ', subscription.plan.amount);
                        let planType = '';
                        if (subscription.plan.id == 'price_1P7yVpSCG87ABkwC64tgfuOh') {
                            planType = 'Monthly';
                        }
                        else if (subscription.plan.id == 'price_1P7zsESCG87ABkwCAjgopRuS') {
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
                        };
                        console.log('data', data);
                        console.log('metaData', req.body.data.object.metaData);
                        const newSubscription = yield this.usecase.createSubscription(data);
                        break;
                    case 'checkout.session.completed':
                        const session = req.body.data.object;
                        console.log(session);
                        console.log('sessionId', session.id);
                        const subscriptionId = session.subscription;
                        console.log(subscriptionId);
                        const result = yield this.usecase.webhook(session.metadata.userId, subscriptionId);
                        break;
                    case 'invoice.payment_failed':
                        const failedPaymentInfo = req.body.object;
                        const userId = failedPaymentInfo.metadata.userId;
                        yield this.usecase.handlePaymentFailure(userId);
                    default:
                        console.log('Unhandled event type');
                }
                res.json({ received: true });
            }
            catch (err) {
                res.status(400).send(`Webhook Error: ${err}`);
                return;
            }
        });
    }
    cancelSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profId = req.profId;
                const cancelled = yield this.usecase.cancelSubscription(profId);
                if (cancelled) {
                    res.status(200).json({ success: true, message: 'Internal server error' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
}
exports.default = ProfController;
