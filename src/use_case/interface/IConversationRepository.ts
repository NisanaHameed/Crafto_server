import Conversation from "../../domain/conversation";
import User from "../../domain/user";

interface IConversationRepository {

    saveConversation(senderId: string, receiverId: string): Promise<Conversation | null>
    getConversations(id: string): Promise<Conversation | null>
    getUserById(id: string): Promise<User | null>
}

export default IConversationRepository;