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
const fs_1 = require("fs");
const path_1 = require("path");
class AdminUsecase {
    constructor(repository, jwt, hash, cloudinary, stripe) {
        this.repository = repository;
        this.jwt = jwt;
        this.hash = hash;
        this.cloudinary = cloudinary;
        this.stripe = stripe;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findAdmin = yield this.repository.findAdminByEmail(email);
                if (findAdmin) {
                    let passwordCheck = yield this.hash.compare(password, findAdmin.password);
                    if (passwordCheck) {
                        let token = this.jwt.generateToken(findAdmin._id, 'admin');
                        return { success: true, adminData: findAdmin, token };
                    }
                    else {
                        return { success: false, message: "Incorrect password" };
                    }
                }
                else {
                    return { success: false, message: "Email not found" };
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield this.stripe.fetchSubscriptions();
                const revenue = subscriptions.data.reduce((acc, sub) => { var _a; return acc + ((_a = sub === null || sub === void 0 ? void 0 : sub.plan) === null || _a === void 0 ? void 0 : _a.amount) * sub.quantity; }, 0);
                const revenueByDate = subscriptions.data.reduce((acc, sub) => {
                    const date = new Date(sub.current_period_start * 1000).toLocaleDateString('en-US');
                    const amount = (sub.plan.amount / 100) * sub.quantity;
                    if (!acc[date]) {
                        acc[date] = 0;
                    }
                    acc[date] += amount;
                    return acc;
                }, {});
                console.log('revenue', revenue);
                const totalRevenue = revenue / 100;
                const data = yield this.repository.getDashboardDetails();
                const result = Object.assign(Object.assign({}, data), { totalRevenue, revenueByDate });
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield this.repository.getUsers(page, limit);
                return users;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blocked = yield this.repository.blockUser(id);
                return blocked;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getProfessionals(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profs = yield this.repository.getProfessionals(page, limit);
                return profs;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    blockProfessional(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blocked = yield this.repository.blockProfessional(id);
                return blocked;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    addCategory(name, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findCategory = yield this.repository.findCategory(name);
                if (findCategory) {
                    return { success: false, message: 'Category already exists!' };
                }
                let upload = yield this.cloudinary.uploadToCloud(image);
                this.deleteImageFile(image.filename);
                let saveData = yield this.repository.saveCategory(name, upload);
                return { success: true, saveData };
            }
            catch (err) {
                throw err;
            }
        });
    }
    editCategory(id, name, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findCategory = yield this.repository.findCategory(name);
                if (findCategory && findCategory._id !== id) {
                    return { success: false, message: 'Category name already exists!' };
                }
                else {
                    let uploadedImage = yield this.cloudinary.uploadToCloud(image);
                    let edited = yield this.repository.editCategory(id, name, uploadedImage);
                    if (edited) {
                        return { success: true };
                    }
                    else {
                        return { success: false, message: 'Category is not added!' };
                    }
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
    addJobrole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findJobrole = yield this.repository.findJobrole(name);
                if (findJobrole) {
                    return { success: false, message: 'Jobrole already exists!' };
                }
                let saveData = yield this.repository.saveJobrole(name);
                return { success: true, saveData };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let categories = yield this.repository.getCategory();
                return categories;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getJobrole() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobrole = yield this.repository.getJobrole();
                return jobrole;
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteJobrole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.deleteJobrole(id);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    editJobrole(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findJobrole = yield this.repository.findJobrole(name);
                if (findJobrole && findJobrole._id == id) {
                    return { success: false, message: 'This is same category name!' };
                }
                else if (findJobrole) {
                    return { success: false, message: 'Jobrole already exists!' };
                }
                let res = yield this.repository.editJobrole(id, name);
                return { success: true, res };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.repository.getSubscriptions();
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getASubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.repository.getASubscription(id);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = AdminUsecase;
