import MessageRepository from './interface/IMessageRepository'
import ConversationRepository from "./interface/IConversationRepository"
import Message from '../domain/message';

class ChatUsecase {

    private conversation: ConversationRepository
    private message: MessageRepository;

    constructor(conversation: ConversationRepository, message: MessageRepository) {
        this.conversation = conversation;
        this.message = message;
    }

    async saveConversation(senderId: string, receiverId: string) {
        try {

            const result = await this.conversation.saveConversation(senderId, receiverId);
            return result;

        } catch (err) {
            throw err;
        }
    }

    async getConversations(id: string) {
        try {
            const conversations = await this.conversation.getConversations(id);
            return conversations;
        } catch (err) {
            throw err;
        }
    }

    async getUserById(id: string) {
        try {
            const res = await this.conversation.getUserById(id);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async newMessage(data: Message) {
        try {
            const messageSaved = await this.message.saveMessage(data);
            return messageSaved;
        } catch (err) {
            throw err;
        }
    }

    async getMessages(conversationId: string) {
        try {
            const messages = await this.message.findMessages(conversationId);
            return messages;
        }catch(err){
            throw err;
        }
    }
}

export default ChatUsecase;