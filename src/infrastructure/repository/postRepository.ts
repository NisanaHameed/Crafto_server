import Post from "../../domain/post";
import IPostRepository from "../../use_case/interface/IPostRepository";
import postModel from "../database/postModel";

class PostRepository implements IPostRepository {
    async savePost(post: Post): Promise<Boolean> {
        try {
            let newPost = new postModel(post);
            await newPost.save();
            return (newPost ? true : false)
        } catch (err) {
            console.log(err);
            throw new Error('Failed to save post!');
        }
    }

    async getPost(profId: string): Promise<Post | null> {
        try{
            let postData:any = await postModel.find({profId:profId});
            return postData
        }catch(err){
            console.log(err);
            throw new Error()
        }
    }
}

export default PostRepository;