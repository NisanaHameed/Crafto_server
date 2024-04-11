import Post from "../../domain/post"

interface IPostRepository {
    savePost(post: Post): Promise<Boolean>
    getPost(profId: string): Promise<Post | null>
    getDesigns(category: string): Promise<Post | null>
    getAllPosts(): Promise<Post | null>
    getPortraits(id: string): Promise<Post | null>
    likePost(id: string, userId: string): Promise<Boolean>
    unlikePost(id: string, userId: string): Promise<Boolean>
    getAPostById(id: string): Promise<Post | null>
}

export default IPostRepository;