import mongoose, { Document, Schema } from "mongoose"
import User from "../../domain/user"

// interface User extends Document {
//     name: string,
//     email: string,
//     mobile: number,
//     password: string,
//     city: string,
//     following: string[],
//     isBlocked: Boolean
// }

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
    image:{
        type:String
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
})

const UserModel = mongoose.model<User>('User',userSchema);
export default UserModel;