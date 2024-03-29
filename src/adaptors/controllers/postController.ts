import { Request, Response } from 'express'
import PostUsecase from "../../use_case/postUsecase";

class PostController {
    private usecase: PostUsecase

    constructor(usecase: PostUsecase) {
        this.usecase = usecase;
    }

    async createPost(req: Request, res: Response) {
        try {
            let profId = req.profId;
            let postData = req.body;
            let image = req.file;
            postData.image = image;
            postData.profId = profId
            let result = await this.usecase.createPost(postData);
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async getPost(req: Request, res: Response) {
        try {
            let profId = req.profId;
            if (profId) {
                let posts = await this.usecase.getPost(profId);
                console.log(posts);
                res.status(200).json({ success: true, posts: posts });
            } else {
                res.status(401).json({ success: false, message: 'No token!' })
            }

        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }
}
export default PostController;