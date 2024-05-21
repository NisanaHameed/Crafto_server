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
const postModel_1 = __importDefault(require("../database/postModel"));
class PostRepository {
    savePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newPost = new postModel_1.default(post);
                yield newPost.save();
                return (newPost ? true : false);
            }
            catch (err) {
                console.log(err);
                throw new Error('Failed to save post!');
            }
        });
    }
    getPost(profId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let postData = yield postModel_1.default.find({ profId: profId });
                return postData;
            }
            catch (err) {
                console.log(err);
                throw new Error();
            }
        });
    }
    getDesigns(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(category);
                let designs = yield postModel_1.default.find({ category: category }).populate('profId');
                return designs;
            }
            catch (err) {
                console.log(err);
                throw new Error('Failed to fetch designs!');
            }
        });
    }
    getAllPosts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let skipIndex = (page - 1) * limit;
                let posts = yield postModel_1.default.find()
                    .populate('profId')
                    .populate('likes.user')
                    .sort({ 'createdAt': -1 })
                    .limit(limit)
                    .skip(skipIndex);
                const total = yield postModel_1.default.countDocuments();
                return { posts, total };
            }
            catch (err) {
                throw new Error('Failed to fetch posts!');
            }
        });
    }
    getPortraits(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let portraits = yield postModel_1.default.find({ profId: id, isPortrait: true });
                console.log(portraits);
                return portraits;
            }
            catch (err) {
                throw new Error('Failed to fetch portrait!');
            }
        });
    }
    likePost(id, userID, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield postModel_1.default.findOneAndUpdate({ _id: id, 'likes.user': { $ne: userID } }, { $push: { likes: { user: userID, type: role } } }, { new: true });
                console.log(updated);
                return updated;
            }
            catch (err) {
                throw new Error('Failed to update the post');
            }
        });
    }
    unlikePost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id, userId);
                const updated = yield postModel_1.default.findOneAndUpdate({ _id: id }, { $pull: { likes: { user: userId } } }, { new: true });
                console.log(updated);
                return updated;
            }
            catch (err) {
                throw new Error('Failed to update the post');
            }
        });
    }
    getAPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findOne({ _id: id }).populate('profId').populate('comments.user').populate('likes.user');
                if (post) {
                    post.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                }
                return post;
            }
            catch (err) {
                throw new Error('Failed to fetch post!');
            }
        });
    }
    addComment(userId, postId, comment, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield postModel_1.default.updateOne({ _id: postId }, {
                    $push: {
                        comments: {
                            user: userId,
                            text: comment,
                            createdAt: new Date(),
                            type: type
                        }
                    }
                });
                return result.acknowledged;
            }
            catch (err) {
                throw new Error('Failed to save comment');
            }
        });
    }
    searchDesigns(searchTerm, category, sort, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('page', page, limit, sort);
                let query = {};
                if (searchTerm) {
                    query.$or = [
                        { category: { $regex: searchTerm, $options: 'i' } },
                        { caption: { $regex: searchTerm, $options: 'i' } },
                    ];
                }
                if (category && category !== 'all') {
                    query.category = category;
                }
                let sortOptions = {};
                if (sort) {
                    sortOptions = { createdAt: sort };
                }
                const total = yield postModel_1.default.countDocuments(query);
                const posts = yield postModel_1.default.find(query).populate('profId')
                    .sort(sortOptions)
                    .skip((page - 1) * limit)
                    .limit(limit);
                return { posts, total };
            }
            catch (err) {
                throw new Error('Failed to fetch data');
            }
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleted = yield postModel_1.default.deleteOne({ _id: id });
                return deleted.acknowledged;
            }
            catch (err) {
                throw new Error('Failed to delete');
            }
        });
    }
}
exports.default = PostRepository;
