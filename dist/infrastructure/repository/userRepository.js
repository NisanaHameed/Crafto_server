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
const userModel_1 = __importDefault(require("../database/userModel"));
const profModel_1 = __importDefault(require("../database/profModel"));
const postModel_1 = __importDefault(require("../database/postModel"));
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userCheck = yield userModel_1.default.findOne({ email: email });
                return userCheck ? userCheck.toObject() : null;
            }
            catch (err) {
                console.error(`Error in findByEmail for email ${email}:`, err);
                throw new Error('Failed to fetch user by email');
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newUser = new userModel_1.default(user);
                yield newUser.save();
                return newUser ? newUser.toObject() : null;
            }
            catch (err) {
                console.log(err);
                throw new Error('Failed to save user');
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userdata = yield userModel_1.default.findById(id).populate({
                    path: 'savedPosts',
                    populate: { path: 'profId' }
                });
                return userdata;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to find user");
            }
        });
    }
    updateUser(id, userdata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updatedUser = yield userModel_1.default.updateOne({ _id: id }, userdata, { new: true });
                console.log(updatedUser);
                return updatedUser.acknowledged;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to update user");
            }
        });
    }
    followProfessional(profId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followed = yield profModel_1.default.updateOne({ _id: profId }, { $addToSet: { followers: userId } });
                return followed.acknowledged;
            }
            catch (err) {
                throw new Error('Failed to follow');
            }
        });
    }
    unfollowProf(profId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unfollowed = yield profModel_1.default.updateOne({ _id: profId }, { $pull: { followers: userId } });
                return unfollowed.acknowledged;
            }
            catch (err) {
                throw new Error('failed to unfollow');
            }
        });
    }
    savePost(postId, userId, save) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saved = false;
                if (save === 'true') {
                    const [savedUserIdInPost, savedInUser] = yield Promise.all([
                        postModel_1.default.updateOne({ _id: postId }, { $addToSet: { saved: userId } }),
                        userModel_1.default.updateOne({ _id: userId }, { $addToSet: { savedPosts: postId } })
                    ]);
                    saved = savedUserIdInPost.acknowledged && savedInUser.acknowledged;
                }
                else {
                    const [unsavedUserIdInPost, unsavedInUser] = yield Promise.all([
                        postModel_1.default.updateOne({ _id: postId }, { $pull: { saved: userId } }),
                        userModel_1.default.updateOne({ _id: userId }, { $pull: { savedPosts: postId } })
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
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield userModel_1.default.updateOne({ email: email }, { $set: { password: password } });
                console.log(result);
                return result.acknowledged;
            }
            catch (err) {
                console.log(err);
                throw new Error('failed to update password!');
            }
        });
    }
}
exports.default = UserRepository;
