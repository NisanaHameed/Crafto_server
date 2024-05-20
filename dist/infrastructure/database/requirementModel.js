"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requirementSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    area: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    workPeriod: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    rooms: {
        type: String
    },
    scope: {
        type: String
    },
    plan: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    },
    mobile: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});
const RequirementModel = mongoose_1.default.model('Requirement', requirementSchema);
exports.default = RequirementModel;
