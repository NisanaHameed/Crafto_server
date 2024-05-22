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
const profModel_1 = __importDefault(require("../database/profModel"));
const postModel_1 = __importDefault(require("../database/postModel"));
const subscriptionModel_1 = __importDefault(require("../database/subscriptionModel"));
class ProfRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield profModel_1.default.findOne({ email: email });
                return data;
            }
            catch (err) {
                throw new Error("Failed to fetch data by email");
            }
        });
    }
    saveProfessional(prof) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newProf = new profModel_1.default(prof);
                yield newProf.save();
                return newProf;
            }
            catch (err) {
                throw new Error("Failed to save data");
            }
        });
    }
    findProfById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield profModel_1.default.findById(id).populate({
                    path: 'savedPosts',
                    populate: { path: 'profId' }
                });
                return data;
            }
            catch (err) {
                throw new Error("Failed to find data by id");
            }
        });
    }
    updateProfile(id, editeddata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield profModel_1.default.updateOne({ _id: id }, { $set: editeddata });
                return data.acknowledged;
            }
            catch (err) {
                throw new Error("Failed to update data");
            }
        });
    }
    updateImage(id, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield profModel_1.default.updateOne({ _id: id }, { $set: { image: image } });
                return data.acknowledged;
            }
            catch (err) {
                throw new Error("Failed to update image");
            }
        });
    }
    updateEmail(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield profModel_1.default.updateOne({ _id: id }, { $set: { email: email } });
                return data.acknowledged;
            }
            catch (err) {
                throw new Error("Failed to update email");
            }
        });
    }
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield profModel_1.default.updateOne({ _id: id }, { $set: { password: password } }, { new: true });
                return data.acknowledged;
            }
            catch (err) {
                throw new Error("Failed to update password");
            }
        });
    }
    findProfessionals(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profs = yield profModel_1.default.find({ _id: { $ne: id } });
                return profs;
            }
            catch (err) {
                throw new Error('Failed to fetch professionals!');
            }
        });
    }
    savePost(postId, profId, save) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = false;
                if (save === 'true') {
                    const [savedUserIdInPost, savedInUser] = yield Promise.all([
                        postModel_1.default.updateOne({ _id: postId }, { $addToSet: { saved: profId } }),
                        profModel_1.default.updateOne({ _id: profId }, { $addToSet: { savedPosts: postId } })
                    ]);
                    saved = savedUserIdInPost.acknowledged && savedInUser.acknowledged;
                }
                else {
                    const [unsavedUserIdInPost, unsavedInUser] = yield Promise.all([
                        postModel_1.default.updateOne({ _id: postId }, { $pull: { saved: profId } }),
                        profModel_1.default.updateOne({ _id: profId }, { $pull: { savedPosts: postId } })
                    ]);
                    saved = unsavedUserIdInPost.acknowledged && unsavedInUser.acknowledged;
                }
                return saved;
            }
            catch (err) {
                throw new Error('Failed to save post!');
            }
        });
    }
    updateIsVerified(profId, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prof = yield profModel_1.default.findOneAndUpdate({ _id: profId }, { $set: { isVerified: isVerified }, $unset: { subscriptionID: 1 } }, { new: true });
                return (prof ? true : false);
            }
            catch (err) {
                throw new Error('Failed to update isVerified');
            }
        });
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSubscription = new subscriptionModel_1.default(data);
                yield newSubscription.save();
                return (newSubscription ? true : false);
            }
            catch (err) {
                throw new Error('Failed to create subscription');
            }
        });
    }
    updateSubscription(profId, subscriptionID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updated;
                if (!subscriptionID.length) {
                    updated = yield subscriptionModel_1.default.updateOne({ profId: profId }, { $set: { status: 'Cancelled' } });
                }
                else {
                    updated = yield subscriptionModel_1.default.updateOne({ subscriptionId: subscriptionID }, { $set: { profId: profId } }, { upsert: true });
                }
                return updated.acknowledged;
            }
            catch (err) {
                throw new Error('Failed to update subscription');
            }
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield profModel_1.default.updateOne({ email: email }, { $set: { password: password } });
                return result.acknowledged;
            }
            catch (err) {
                throw new Error('failed to update password!');
            }
        });
    }
}
exports.default = ProfRepository;
