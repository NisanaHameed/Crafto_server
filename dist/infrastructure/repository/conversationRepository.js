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
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
const userModel_1 = __importDefault(require("../database/userModel"));
class ConversationRepository {
    saveConversation(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findConversation = yield conversationModel_1.default.findOne({ members: { $all: [senderId, receiverId] } });
                console.log(findConversation);
                if (findConversation) {
                    return findConversation;
                }
                const newConversation = new conversationModel_1.default({ members: [senderId, receiverId] });
                yield newConversation.save();
                return newConversation;
            }
            catch (err) {
                throw new Error('Failed to save new conversation');
            }
        });
    }
    getConversations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.default.find({ members: { $in: [id] } }).sort({ updatedAt: -1 });
                return conversations;
            }
            catch (err) {
                throw new Error('Failed to fetch conversations');
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ _id: id });
                return user;
            }
            catch (err) {
                throw new Error('Failed to fetch userdata');
            }
        });
    }
}
exports.default = ConversationRepository;
