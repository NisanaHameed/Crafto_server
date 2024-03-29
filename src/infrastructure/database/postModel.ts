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
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isPortrait:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

const postModel = mongoose.model('Post',postSchema);
export default postModel;