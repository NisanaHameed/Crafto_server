import Message from "../../domain/message";
import IMessageRepository from "../../use_case/interface/IMessageRepository";
import messageModel from "../database/messageModel";

class MessageRepository implements IMessageRepository {

    async saveMessage(chat: Message): Promise<Boolean | null> {

        try {
            console.log('In saveMessage')
            const newMessage = new messageModel(chat);
            await newMessage.save();
            console.log(newMessage)
            return (newMessage ? true : false);
        } catch (err) {
            throw new Error('Failed to save message!');
        }
    }

    async findMessages(conversationId: string): Promise<Message | null> {
        try {
            const messages:any = await messageModel.find({ conversationId: conversationId });
            return messages;
        } catch (err) {
            throw new Error('Failed to fetch messages');
        }
    }
}

export default MessageRepository;