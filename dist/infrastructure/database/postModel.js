"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    profId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isPortrait: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                refPath: 'likes.type',
                required: true
            },
            type: {
                type: String,
                enum: ['User', 'Professional'],
                required: true
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                refPath: 'comments.type',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now,
                required: true
            },
            type: {
                type: String,
                enum: ['User', 'Professional'],
                required: true
            }
        }
    ],
    saved: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ]
}, { timestamps: true });
const postModel = mongoose_1.default.model('Post', postSchema);
exports.default = postModel;
