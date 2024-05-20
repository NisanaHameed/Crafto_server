"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    profId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
const subscriptionModel = mongoose_1.default.model('Subscription', subscriptionSchema);
exports.default = subscriptionModel;
