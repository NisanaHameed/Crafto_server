import Post from "../../domain/post"

interface IPostRepository{
    savePost(post:Post):Promise<Boolean>
    getPost(profId:string):Promise<Post | null>
    getDesigns(category:string):Promise<Post | null>
    getAllPosts():Promise<Post | null>
    getPortraits(id:string):Promise<Post | null>
}

export default IPostRepository;