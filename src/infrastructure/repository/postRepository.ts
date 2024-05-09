import Post from "../../domain/post";
import IPostRepository from "../../use_case/interface/IPostRepository";
import postModel from "../database/postModel";
interface ISearch {
    posts: Post;
    total: number
}

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

    async getAllPosts(page: number, limit: number): Promise<ISearch | null> {
        try {
            let skipIndex = (page - 1) * limit;
            let posts: any = await postModel.find()
                .populate('profId')
                .populate('likes.user')
                .sort({ 'createdAt': -1 })
                .limit(limit)
                .skip(skipIndex)
            const total = await postModel.countDocuments();
            return { posts, total };
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
    async likePost(id: string, userID: string, role: string): Promise<Boolean> {
        try {
            const updated = await postModel.updateOne({ _id: id, 'likes.user': { $ne: userID } }, { $push: { likes: { user: userID, type: role } } });
            return updated.acknowledged;
        } catch (err) {
            throw new Error('Failed to update the post');
        }
    }

    async unlikePost(id: string, userId: string): Promise<Boolean> {
        try {
            console.log(id, userId)
            const updated = await postModel.updateOne({ _id: id }, { $pull: { likes: { user: userId } } });
            return updated.acknowledged;
        } catch (err) {
            throw new Error('Failed to update the post');
        }
    }

    async getAPostById(id: string): Promise<Post | null> {
        try {
            const post = await postModel.findOne({ _id: id }).populate('profId').populate('comments.user').populate('likes.user');
            if (post) {
                post.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            }
            return post;
        } catch (err) {
            throw new Error('Failed to fetch post!');
        }
    }
    async addComment(userId: string, postId: string, comment: string, type: string): Promise<Boolean> {
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

    async searchDesigns(searchTerm: string, category: string, sort: number, page: number, limit: number): Promise<ISearch | null> {
        try {
            console.log('page', page, limit, sort)
            let query: any = {};
            if (searchTerm) {
                query.$or = [
                    { category: { $regex: searchTerm, $options: 'i' } },
                ]
            }
            if (category && category !== 'all') {
                query.category = category;
            }
            let sortOptions = {};
            if (sort) {
                sortOptions = { createdAt: sort };
            }
            const total = await postModel.countDocuments(query);
            const posts: any = await postModel.find(query).populate('profId')
                .sort(sortOptions)
                .skip((page - 1) * limit)
                .limit(limit);
            return { posts, total };
        } catch (err) {
            throw new Error('Failed to fetch data');
        }
    }

}

export default PostRepository;