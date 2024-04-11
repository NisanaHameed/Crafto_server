import mongoose, { Schema } from "mongoose";
import Message from "../../domain/message";

const messageSchema:Schema<Message> = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        refPath: 'Professional',
        required: true
    },
    // receiver: {
    //     type: Schema.Types.ObjectId,
    //     refPath: 'receiverType',
    //     required: true
    // },
    // senderType: {
    //     type: String,
    //     enum: ['User', 'Professional'],
    //     required: true
    // },
    // receiverType: {
    //     type: String,
    //     enum: ['User', 'Professional'],
    //     required: true
    // },
    text: {
        type: String,
        required: true
    },
    conversationId:{
        type:Schema.Types.ObjectId,
        ref:'Conversation',
        required:true
    },
}, { timestamps: true })

const chatModel = mongoose.model<Message>('Message', messageSchema);
export default chatModel;