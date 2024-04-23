import Subscription from "../../domain/subscription";
import mongoose, { Schema } from "mongoose";

const subscriptionSchema: Schema<Subscription> = new mongoose.Schema({
    profId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professional',
    },
    subscriptionId: {
        type: String,
        required: true
    },
    plan: {
        planType: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled'],
        required: true
    }
})

const subscriptionModel = mongoose.model<Subscription>('Subscription', subscriptionSchema);
export default subscriptionModel;