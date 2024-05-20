"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProfSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    job: {
        type: String
    },
    experience: {
        type: Number
    },
    company: {
        type: String
    },
    bio: {
        type: String
    },
    image: {
        type: String
    },
    followers: [
        {
            type: String,
            ref: 'User',
            default: []
        }
    ],
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
    ],
    subscriptionID: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});
const ProfModel = mongoose_1.default.model('Professional', ProfSchema);
exports.default = ProfModel;
