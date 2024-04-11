import { ObjectId,Types } from "mongoose"

interface Post{
    _id?:string
    profId:ObjectId
    category:string
    caption:string
    image:string
    isPortrait:Boolean
    likes:Array<string>
    comments:Array<comment>
}
interface comment{
    user:string
    text:string
    createdAt:Date
}

export default Post;