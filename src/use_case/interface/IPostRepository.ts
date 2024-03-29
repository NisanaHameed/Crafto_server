import Post from "../../domain/post"

interface IPostRepository{
    savePost(post:Post):Promise<Boolean>
    getPost(profId:string):Promise<Post | null>
}

export default IPostRepository;