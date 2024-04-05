import Post from "../domain/post";
import Cloudinary from "../infrastructure/utils/cloudinary";
import PostRepository from "../infrastructure/repository/postRepository";

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
}
export default PostUsecase;