import Message from "../../domain/message";
import IMessageRepository from "../../use_case/interface/IMessageRepository";
import conversationModel from "../database/conversationModel";
import messageModel from "../database/messageModel";

class MessageRepository implements IMessageRepository {

    async saveMessage(chat: Message): Promise<Message | null> {

        try {
            const newMessage = new messageModel(chat);
            await newMessage.save();
            await conversationModel.updateOne({ _id: chat.conversationId }, { $set: { updatedAt: Date.now() } });
            return newMessage;
        } catch (err) {
            throw new Error('Failed to save message!');
        }
    }

    async findMessages(conversationId: string): Promise<Message | null> {
        try {
            const messages: any = await messageModel.find({ conversationId: conversationId });
            return messages;
        } catch (err) {
            throw new Error('Failed to fetch messages');
        }
    }
}

export default MessageRepository;