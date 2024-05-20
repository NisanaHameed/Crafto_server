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
class ChatController {
    constructor(usecase) {
        this.usecase = usecase;
    }
    newConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let senderId = req.userId;
                // let senderId = '66054acff4efb06f3be368e8'
                const receiverId = req.params.id;
                if (senderId) {
                    const newConversation = yield this.usecase.saveConversation(senderId, receiverId);
                    res.status(200).json({ success: true, newConversation });
                }
                else {
                    res.status(401).json({ success: false, message: 'User is not authenticated!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.profId;
                if (id) {
                    const conversations = yield this.usecase.getConversations(id);
                    res.status(200).json({ success: true, conversations });
                }
                else {
                    res.status(401).json({ success: false, message: 'Internal server error!' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                const user = yield this.usecase.getUserById(id);
                res.status(200).json({ success: true, user });
            }
            catch (err) {
                res.status(500).json({ success: false, message: err });
            }
        });
    }
    newMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const message = yield this.usecase.newMessage(data);
                if (message) {
                    res.status(200).json({ success: true, message });
                }
                else {
                    res.status(500).json({ success: false, message: 'Message is not saved.try again' });
                }
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.params.id;
                const messages = yield this.usecase.getMessages(conversationId);
                res.status(200).json({ success: true, messages });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.default = ChatController;
