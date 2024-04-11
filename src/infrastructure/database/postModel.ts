import mongoose, { Schema } from "mongoose";
import Post from "../../domain/post";

const postSchema: Schema<Post> = new mongoose.Schema({
    profId: {
        type: mongoose.Schema.Types.ObjectId,
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
            type: String,
            default: []
            // {
            //     user: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         refPath: 'likes.type',
            //         required: true
            //     },
            //     type: {
            //         type: String,
            //         enum: ['User', 'Professional'],
            //         required: true
            //     }
            // }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
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
    ]
}, { timestamps: true });

const postModel = mongoose.model('Post', postSchema);
export default postModel;