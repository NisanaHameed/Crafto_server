import mongoose, { Document, Schema } from "mongoose"
import User from "../../domain/user"

const userSchema: Schema<User> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: []
        }
    ]
})

const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;