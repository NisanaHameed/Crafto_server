import mongoose, { Schema } from "mongoose";

const conversationSchema = new mongoose.Schema({

    members: [
        {
            type: Schema.Types.ObjectId,
            required: true

        }
    ],
}, { timestamps: true })

const conversationModel = mongoose.model('Conversation', conversationSchema);
export default conversationModel;