import mongoose, { Schema, mongo } from "mongoose";
import Notification from "../../domain/notification";

const notificationSchema: Schema<Notification> = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    category: {
        type: String,
        required: true
    },
    readStatus: {
        type: Boolean,
        default: false
    }
})

const notificationModel = mongoose.model<Notification>('Notification', notificationSchema);
export default notificationModel;