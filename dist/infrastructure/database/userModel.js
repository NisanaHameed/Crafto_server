"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    following: {
        type: [String],
        ref: 'Professional',
        default: []
    },
    image: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    savedPosts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Post',
            default: []
        }
    ]
});
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
