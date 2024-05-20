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
Object.defineProperty(exports, "__esModule", { value: true });
class NotificationController {
    constructor(usecase) {
        this.usecase = usecase;
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.profId;
                const notifications = yield this.usecase.getNotifications(id);
                res.status(200).json({ success: true, notifications });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    updateNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const updated = yield this.usecase.updateNotification(id);
                if (updated) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal server error' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
}
exports.default = NotificationController;
