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
class ChatUsecase {
    constructor(conversation, message) {
        this.conversation = conversation;
        this.message = message;
    }
    saveConversation(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.conversation.saveConversation(senderId, receiverId);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getConversations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield this.conversation.getConversations(id);
                return conversations;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.conversation.getUserById(id);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    newMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageSaved = yield this.message.saveMessage(data);
                return messageSaved;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.message.findMessages(conversationId);
                return messages;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = ChatUsecase;
