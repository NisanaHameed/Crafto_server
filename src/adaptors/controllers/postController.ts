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
            let filename = req.file?.filename;
            let result = await this.usecase.createPost(postData, filename as string);
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

    async getDesigns(req: Request, res: Response) {
        try {
            let category = req.params.category;
            let posts = await this.usecase.getDesigns(category);
            if (posts) {
                console.log(posts)
                res.status(200).json({ success: true, posts });
            } else {
                res.status(500).json({ success: false, message: 'Failed to fetch data' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async getAllPosts(req: Request, res: Response) {
        try {
            let page = req.query.page || 1;
            let limit = parseInt(req.query.limit as string);
            let data = await this.usecase.getAllPosts(page as number, limit);
            res.status(200).json({ success: true, posts: data?.posts, total: data?.total });
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async getPortraits(req: Request, res: Response) {
        try {
            let id = req.profId;
            if (id) {
                let portraits = await this.usecase.getPortraits(id);
                res.status(200).json({ success: true, portraits });
            } else {
                res.status(500).json({ success: false, message: 'Failed to fetch data!' });
            }

        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async getPostsById(req: Request, res: Response) {
        try {
            let profId = req.params.id;
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

    async likeByUSer(req: Request, res: Response) {
        try {
            let postid = req.params.id;
            let userId = req.userId;
            if (userId) {
                const updated = await this.usecase.likePost(postid, userId, 'User')
                if (updated) {
                    res.status(200).json({ success: true, post: updated });
                } else {
                    res.status(500).json({ success: false, message: 'Failed to update' })
                }
            } else {
                res.status(401).json({ success: false, message: 'Please try again!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async unlikeByUser(req: Request, res: Response) {
        try {
            let postid = req.params.id;
            let userId = req.userId;
            if (userId) {
                const updated = await this.usecase.unlikePost(postid, userId)
                if (updated) {
                    res.status(200).json({ success: true, post: updated });
                } else {
                    res.status(500).json({ success: false, message: 'Failed to update' })
                }
            } else {
                res.status(401).json({ success: false, message: 'Please try again!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }
    async likeByProf(req: Request, res: Response) {
        try {
            let postid = req.params.id;
            let userId = req.profId;

            if (userId) {
                const updated = await this.usecase.likePost(postid, userId, 'Professional')
                if (updated) {
                    res.status(200).json({ success: true, post: updated });
                } else {
                    res.status(500).json({ success: false, message: 'Failed to update' })
                }
            } else {
                res.status(401).json({ success: false, message: 'Please try again!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async unlikeByProf(req: Request, res: Response) {
        try {
            let postid = req.params.id;
            let userId = req.profId;
            if (userId) {
                const updated = await this.usecase.unlikePost(postid, userId)
                if (updated) {
                    res.status(200).json({ success: true, post: updated });
                } else {
                    res.status(500).json({ success: false, message: 'Failed to update' })
                }
            } else {
                res.status(401).json({ success: false, message: 'Please try again!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async getAPostById(req: Request, res: Response) {
        try {
            let id = req.params.id as string;
            const post = await this.usecase.getAPostBtId(id);
            res.status(200).json({ success: true, post });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async addCommentbyUser(req: Request, res: Response) {
        try {
            let userId = req.userId as string;
            let postId = req.body.postId;
            let comment = req.body.comment;
            let result = await this.usecase.addComment(userId, postId, comment, 'User');
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async addCommentbyProf(req: Request, res: Response) {
        try {
            let userId = req.profId as string;
            let postId = req.body.postId;
            let comment = req.body.comment;
            let result = await this.usecase.addComment(userId, postId, comment, 'Professional');
            if (result) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async searchDesigns(req: Request, res: Response) {
        try {
            let { searchTerm, category, sort, page, limit } = req.query;
            console.log('sort', sort)
            const data = await this.usecase.searchDesigns(searchTerm as string, category as string, parseInt(sort as string), parseInt(page as string), parseInt(limit as string));
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const id = req.params.id;
            let deleted = await this.usecase.deletePost(id);
            if (deleted) {
                res.status(200).json({ success: true, message: 'Post deleted!' });
            } else {
                res.status(500).json({ success: false, message: 'Failed to delete post!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
}
export default PostController;