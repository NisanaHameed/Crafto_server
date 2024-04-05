import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderType',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        refPath: 'receiverType',
        required: true
    },
    senderType: {
        type: String,
        enum: ['User', 'Professional'],
        required: true
    },
    receiverType: {
        type: String,
        enum: ['User', 'Professional'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

const chatModel = mongoose.model('Chat',chatSchema);
export default chatModel;