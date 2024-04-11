import conversationModel from "../database/conversationModel";
import Conversation from "../../domain/conversation";
import IConversationRepository from "../../use_case/interface/IConversationRepository";
import User from "../../domain/user";
import UserModel from "../database/userModel";

class ConversationRepository implements IConversationRepository {

    async saveConversation(senderId: string, receiverId: string): Promise<Conversation | null> {
        try {
            const findConversation: any = await conversationModel.findOne({ members: { $all: [senderId, receiverId] } });
            console.log(findConversation)
            if (findConversation) {
                return findConversation
            }

            const newConversation: any = new conversationModel({ members: [senderId, receiverId] });
            await newConversation.save();
            return newConversation;

        } catch (err) {
            throw new Error('Failed to save new conversation');
        }
    }

    async getConversations(id: string): Promise<Conversation | null> {

        try {
            const conversations: any = await conversationModel.find({ members: { $in: [id] } });
            return conversations;
        } catch (err) {
            throw new Error('Failed to fetch conversations');
        }
    }

    async getUserById(id: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ _id: id });
            return user;
        } catch (err) {
            throw new Error('Failed to fetch userdata');
        }
    }
}

export default ConversationRepository;