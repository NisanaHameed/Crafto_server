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
class PostUsecase {
    constructor(cloudinary, repository) {
        this.cloudinary = cloudinary;
        this.repository = repository;
    }
    createPost(post, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let uploadImage = yield this.cloudinary.uploadToCloud(post.image);
                post.image = uploadImage;
                this.deleteImageFile(filename);
                let res = yield this.repository.savePost(post);
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
    getPost(profId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.getPost(profId);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDesigns(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.getDesigns(category);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAllPosts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.getAllPosts(page, limit);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getPortraits(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.repository.getPortraits(id);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    likePost(id, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield this.repository.likePost(id, userId, role);
                return updated;
            }
            catch (err) {
                throw err;
            }
        });
    }
    unlikePost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield this.repository.unlikePost(id, userId);
                return updated;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAPostBtId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.repository.getAPostById(id);
                return post;
            }
            catch (err) {
                throw err;
            }
        });
    }
    addComment(userId, postId, comment, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.addComment(userId, postId, comment, type);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    searchDesigns(searchTerm, category, sort, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.repository.searchDesigns(searchTerm, category, sort, page, limit);
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleted = yield this.repository.deletePost(id);
                return deleted;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = PostUsecase;
