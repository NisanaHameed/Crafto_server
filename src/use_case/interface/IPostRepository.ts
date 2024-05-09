import Post from "../../domain/post"
interface ISearch {
    posts: Post;
    total: number
}

interface IPostRepository {
    savePost(post: Post): Promise<Boolean>
    getPost(profId: string): Promise<Post | null>
    getDesigns(category: string): Promise<Post | null>
    getAllPosts(page: number, limit: number): Promise<ISearch | null>
    getPortraits(id: string): Promise<Post | null>
    likePost(id: string, userId: string, role: string): Promise<Boolean>
    unlikePost(id: string, userId: string): Promise<Boolean>
    getAPostById(id: string): Promise<Post | null>
    addComment(userId: string, postId: string, comment: string, type: string): Promise<Boolean>
    searchDesigns(searchTerm: string, category: string, sort: number, page: number, limit: number): Promise<ISearch | null>
}

export default IPostRepository;