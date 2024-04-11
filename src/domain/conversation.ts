import { ObjectId } from "mongoose"

interface Conversation{
    members:Array<ObjectId>
    // messages:Array<ObjectId>
}
// interface member{
//     userId:ObjectId,
//     userType:string
// }

export default Conversation;