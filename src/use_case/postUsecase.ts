import Post from "../domain/post";
import Cloudinary from "../infrastructure/utils/cloudinary";
import PostRepository from "./interface/IPostRepository";

class PostUsecase {
    private cloudinary: Cloudinary
    private repository: PostRepository

    constructor(cloudinary: Cloudinary, repository: PostRepository) {
        this.cloudinary = cloudinary;
        this.repository = repository;
    }

    async createPost(post: Post) {
        try {
            let uploadImage = await this.cloudinary.uploadToCloud(post.image);
            post.image = uploadImage;
            let res = await this.repository.savePost(post);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async getPost(profId: string) {
        try {
            let res = await this.repository.getPost(profId);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async getDesigns(category: string) {
        try {
            let res = await this.repository.getDesigns(category);
            return res;
        } catch (err) {
            throw err;
        }
    }
    async getAllPosts() {
        try {
            let res = await this.repository.getAllPosts();
            return res;
        } catch (err) {
            throw err;
        }
    }
    async getPortraits(id: string) {
        try {
            let res = await this.repository.getPortraits(id);
            return res;
        } catch (err) {
            throw err;
        }
    }
    async likePost(id: string, userId: string) {
        try {
            const updated = await this.repository.likePost(id, userId);
            return updated;
        } catch (err) {
            throw err;
        }
    }
    async unlikePost(id: string, userId: string) {
        try {
            const updated = await this.repository.unlikePost(id, userId);
            return updated;
        } catch (err) {
            throw err;
        }
    }

    async getAPostBtId(id: string) {
        try {
            const post = await this.repository.getAPostById(id);
            return post;
        } catch (err) {
            throw err;
        }
    }

    async addComment(userId: string, postId: string, comment: string, type: string) {
        try {
            const result = await this.repository.addComment(userId, postId, comment, type);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
export default PostUsecase;