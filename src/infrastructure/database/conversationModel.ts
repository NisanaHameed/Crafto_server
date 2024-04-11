import mongoose, { Schema } from "mongoose";

const conversationSchema = new mongoose.Schema({
    
    members: [
        {
            type:Schema.Types.ObjectId,
            required:true
            // userId: {
            //     type: Schema.Types.ObjectId,
            //     ref: 'userType',
            //     required: true
            // },
            // userType: {
            //     type: String,
            //     enum: ['User', 'Professional'],
            //     required: true
            // }
        }
    ],
    // messages: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Message',
    //         default: []
    //     }
    // ]
}, { timestamps: true })

const conversationModel = mongoose.model('Conversation', conversationSchema);
export default conversationModel;