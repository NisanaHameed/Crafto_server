import { ObjectId } from "mongoose";

interface Message{
    _id?:string
    senderId:ObjectId,
    text:string,
    // senderType:string,
    conversationId:ObjectId,
    timestamp:Date
}

export default Message;