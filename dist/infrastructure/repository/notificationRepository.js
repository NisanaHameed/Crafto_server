"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationModel_1 = __importDefault(require("../database/notificationModel"));
class NotificationRepository {
    getNotifications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.default.find({ userId: id });
                return notifications;
            }
            catch (err) {
                throw new Error('Failed to fetch notifications!');
            }
        });
    }
    updateNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield notificationModel_1.default.updateOne({ _id: id }, { $set: { readStatus: true } });
                console.log(updated);
                return updated.acknowledged;
            }
            catch (err) {
                throw new Error("Failed to update notification");
            }
        });
    }
}
exports.default = NotificationRepository;
