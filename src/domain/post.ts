import { ObjectId } from "mongoose"

interface Post{
    _id?:string
    profId:ObjectId
    category:string
    caption:string
    image:string
    isPortrait:Boolean
}

export default Post;