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
class PostController {
    constructor(usecase) {
        this.usecase = usecase;
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let profId = req.profId;
                let postData = req.body;
                let image = req.file;
                postData.image = image;
                postData.profId = profId;
                let filename = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                let result = yield this.usecase.createPost(postData, filename);
                if (result) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profId = req.profId;
                if (profId) {
                    let posts = yield this.usecase.getPost(profId);
                    console.log(posts);
                    res.status(200).json({ success: true, posts: posts });
                }
                else {
                    res.status(401).json({ success: false, message: 'No token!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getDesigns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let category = req.params.category;
                let posts = yield this.usecase.getDesigns(category);
                if (posts) {
                    console.log(posts);
                    res.status(200).json({ success: true, posts });
                }
                else {
                    res.status(500).json({ success: false, message: 'Failed to fetch data' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page = req.query.page || 1;
                let limit = parseInt(req.query.limit);
                let data = yield this.usecase.getAllPosts(page, limit);
                res.status(200).json({ success: true, posts: data === null || data === void 0 ? void 0 : data.posts, total: data === null || data === void 0 ? void 0 : data.total });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    getPortraits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.profId;
                if (id) {
                    let portraits = yield this.usecase.getPortraits(id);
                    res.status(200).json({ success: true, portraits });
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
    getPostsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let profId = req.params.id;
                if (profId) {
                    let posts = yield this.usecase.getPost(profId);
                    console.log(posts);
                    res.status(200).json({ success: true, posts: posts });
                }
                else {
                    res.status(401).json({ success: false, message: 'No token!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    likeByUSer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let postid = req.params.id;
                let userId = req.userId;
                if (userId) {
                    const updated = yield this.usecase.likePost(postid, userId, 'User');
                    if (updated) {
                        res.status(200).json({ success: true, post: updated });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Failed to update' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'Please try again!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    unlikeByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let postid = req.params.id;
                let userId = req.userId;
                if (userId) {
                    const updated = yield this.usecase.unlikePost(postid, userId);
                    if (updated) {
                        res.status(200).json({ success: true, post: updated });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Failed to update' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'Please try again!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    likeByProf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let postid = req.params.id;
                let userId = req.profId;
                if (userId) {
                    const updated = yield this.usecase.likePost(postid, userId, 'Professional');
                    if (updated) {
                        res.status(200).json({ success: true, post: updated });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Failed to update' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'Please try again!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    unlikeByProf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let postid = req.params.id;
                let userId = req.profId;
                if (userId) {
                    const updated = yield this.usecase.unlikePost(postid, userId);
                    if (updated) {
                        res.status(200).json({ success: true, post: updated });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Failed to update' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: 'Please try again!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getAPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const post = yield this.usecase.getAPostBtId(id);
                res.status(200).json({ success: true, post });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    addCommentbyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.userId;
                let postId = req.body.postId;
                let comment = req.body.comment;
                let result = yield this.usecase.addComment(userId, postId, comment, 'User');
                if (result) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    addCommentbyProf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.profId;
                let postId = req.body.postId;
                let comment = req.body.comment;
                let result = yield this.usecase.addComment(userId, postId, comment, 'Professional');
                if (result) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    searchDesigns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { searchTerm, category, sort, page, limit } = req.query;
                console.log('sort', sort);
                const data = yield this.usecase.searchDesigns(searchTerm, category, parseInt(sort), parseInt(page), parseInt(limit));
                res.status(200).json({ success: true, data });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                let deleted = yield this.usecase.deletePost(id);
                if (deleted) {
                    res.status(200).json({ success: true, message: 'Post deleted!' });
                }
                else {
                    res.status(500).json({ success: false, message: 'Failed to delete post!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
}
exports.default = PostController;
