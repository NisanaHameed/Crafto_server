import Post from "../../domain/post";
import IPostRepository from "../../use_case/interface/IPostRepository";
import postModel from "../database/postModel";

class PostRepository implements IPostRepository {
    async savePost(post: Post): Promise<Boolean> {
        try {
            let newPost = new postModel(post);
            await newPost.save();
            return (newPost ? true : false);
        } catch (err) {
            console.log(err);
            throw new Error('Failed to save post!');
        }
    }

    async getPost(profId: string): Promise<Post | null> {
        try {
            let postData: any = await postModel.find({ profId: profId });
            return postData;
        } catch (err) {
            console.log(err);
            throw new Error();
        }
    }

    async getDesigns(category: string): Promise<Post | null> {
        try {
            console.log(category);
            let designs: any = await postModel.find({ category: category }).populate('profId');
            return designs;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to fetch designs!');
        }
    }

    async getAllPosts(): Promise<Post | null> {
        try {
            let posts: any = await postModel.find().populate('profId').sort({ 'createdAt': -1 });
            return posts;
        } catch (err) {
            throw new Error('Failed to fetch posts!');
        }
    }

    async getPortraits(id: string): Promise<Post | null> {
        try {
            let portraits: any = await postModel.find({ profId: id, isPortrait: true });
            console.log(portraits);
            return portraits;
        } catch (err) {
            throw new Error('Failed to fetch portrait!');
        }
    }
    async likePost(id: string, userID: string): Promise<Boolean> {
        try {
            const updated = await postModel.updateOne({ _id: id }, { $addToSet: { likes: userID } });
            return updated.acknowledged;
        } catch (err) {
            throw new Error('Failed to update the post');
        }
    }

    async unlikePost(id: string, userId: string): Promise<Boolean> {
        try {
            const updated = await postModel.updateOne({ _id: id }, { $pull: { likes: userId } });
            return updated.acknowledged;
        } catch (err) {
            throw new Error('Failed to update the post');
        }
    }

    async getAPostById(id: string): Promise<Post | null> {
        try {
            const post = await postModel.findOne({ _id: id }).populate('profId').populate('comments.user');
            if(post){
                post.comments.sort((a,b)=>b.createdAt.getTime()-a.createdAt.getTime());
            }
            return post;
        } catch (err) {
            throw new Error('Failed to fetch post!');
        }
    }
    async addComment(userId: string, postId: string, comment: string,type:string): Promise<Boolean> {
        try {
            const result = await postModel.updateOne({ _id: postId }, {
                $push: {
                    comments: {
                        user: userId,
                        text: comment,
                        createdAt: new Date(),
                        type: type
                    }
                }
            });
            return result.acknowledged;
        } catch (err) {
            throw new Error('Failed to save comment');
        }
    }

}

export default PostRepository;