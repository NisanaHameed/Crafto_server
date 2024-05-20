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
const adminModel_1 = __importDefault(require("../database/adminModel"));
const profModel_1 = __importDefault(require("../database/profModel"));
const userModel_1 = __importDefault(require("../database/userModel"));
const categoryModel_1 = __importDefault(require("../database/categoryModel"));
const jobroleModel_1 = __importDefault(require("../database/jobroleModel"));
const subscriptionModel_1 = __importDefault(require("../database/subscriptionModel"));
class AdminRepository {
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let admindata = yield adminModel_1.default.findOne({ email: email });
                return admindata;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to find admin by email");
            }
        });
    }
    getUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let skipIndex = (page - 1) * limit;
                let users = yield userModel_1.default.find()
                    .limit(limit)
                    .skip(skipIndex);
                const total = yield userModel_1.default.countDocuments();
                return { users, total };
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to fetch users");
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('id' + id);
                let user = yield userModel_1.default.findById(id);
                console.log('user' + user);
                if (user) {
                    yield userModel_1.default.findByIdAndUpdate(id, { $set: { isBlocked: !user.isBlocked } });
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to block user");
            }
        });
    }
    getProfessionals(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let skipIndex = (page - 1) * limit;
                let professionals = yield profModel_1.default.find()
                    .limit(limit)
                    .skip(skipIndex);
                const total = yield profModel_1.default.countDocuments();
                return { professionals, total };
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to fetch users");
            }
        });
    }
    blockProfessional(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let prof = yield profModel_1.default.findById(id);
                if (prof) {
                    yield profModel_1.default.findByIdAndUpdate(id, { $set: { isBlocked: !prof.isBlocked } });
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to block user");
            }
        });
    }
    saveCategory(name, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newData = new categoryModel_1.default({
                    name: name,
                    image: image
                });
                yield newData.save();
                return newData ? true : false;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to save category");
            }
        });
    }
    findCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let category = yield categoryModel_1.default.findOne({ name: { $regex: name, $options: 'i' } });
                return category;
            }
            catch (err) {
                throw new Error('Failed to find category');
            }
        });
    }
    editCategory(id, name, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let edited = yield categoryModel_1.default.updateOne({ _id: id }, { $set: { name: name } });
                return edited.acknowledged;
            }
            catch (err) {
                throw new Error('Failed to edit category!');
            }
        });
    }
    saveJobrole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newData = new jobroleModel_1.default({ name: name });
                yield newData.save();
                return newData ? true : false;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to save category");
            }
        });
    }
    findJobrole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jobrole = yield jobroleModel_1.default.findOne({ name: { $regex: name, $options: 'i' } });
                return jobrole;
            }
            catch (err) {
                throw new Error('Failed to find job role');
            }
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryModel_1.default.find();
                return categories;
            }
            catch (err) {
                console.log(err);
                throw new Error('Failed to fetch categories');
            }
        });
    }
    getJobrole() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobrole = yield jobroleModel_1.default.find();
                return jobrole;
            }
            catch (err) {
                console.log(err);
                throw new Error('Failed to fetch jobroles!');
            }
        });
    }
    deleteJobrole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield jobroleModel_1.default.deleteOne({ _id: id });
                console.log(res);
                return res.deletedCount == 1;
            }
            catch (err) {
                throw new Error('Failed to delete jobrole!');
            }
        });
    }
    editJobrole(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield jobroleModel_1.default.updateOne({ _id: id }, { $set: { name: name } });
                console.log(res);
                return (res ? true : false);
            }
            catch (err) {
                throw new Error('Failed to edit jobrole!');
            }
        });
    }
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield subscriptionModel_1.default.find().populate('profId');
                return data;
            }
            catch (err) {
                throw new Error('Failed to fetch subscriptions');
            }
        });
    }
    getASubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield subscriptionModel_1.default.findOne({ profId: id }).populate('profId');
                return data;
            }
            catch (err) {
                throw new Error('Failed to fetch subscription');
            }
        });
    }
    getDashboardDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unblockedUsers = yield userModel_1.default.countDocuments({ isBlocked: false });
                const blockedUsers = yield userModel_1.default.countDocuments({ isBlocked: true });
                const unblockedProfs = yield profModel_1.default.countDocuments({ isBlocked: false });
                const blockedProfs = yield profModel_1.default.countDocuments({ isBlocked: true });
                const activeSubscriptions = yield subscriptionModel_1.default.countDocuments({ status: 'Active' });
                const cancelledSubscriptions = yield subscriptionModel_1.default.countDocuments({ status: 'Cancelled' });
                return { unblockedUsers, blockedUsers, unblockedProfs, blockedProfs, activeSubscriptions, cancelledSubscriptions };
            }
            catch (err) {
                throw new Error('Failed to fetch data!');
            }
        });
    }
}
exports.default = AdminRepository;
