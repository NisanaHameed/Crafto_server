import Message from "../../domain/message";
import Chat from "../../domain/message"

interface IMessageRepository{
    saveMessage(chat:Chat):Promise<Boolean | null>
    findMessages(conversationId:string):Promise<Message | null>
}

export default IMessageRepository;