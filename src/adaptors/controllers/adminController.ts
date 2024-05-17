import { Request, Response } from 'express'
import AdminUsecase from "../../use_case/adminUsecase";

class AdminController {
    private usecase;
    constructor(usecase: AdminUsecase) {
        this.usecase = usecase;
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            let data = await this.usecase.login(email, password);
            if (data.success) {
                res.cookie('adminToken', data.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                })
                res.status(200).json(data)
            } else {
                res.status(401).json(data)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async getDashboard(req: Request, res: Response) {
        try {
            const data = await this.usecase.getDashboard();
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            let page = req.query.page || 1;
            let limit = parseInt(req.query.limit as string);
            let users = await this.usecase.getUsers(page as number, limit);

            if (users) {
                res.status(200).json({ success: true, users: users.users, total: users.total })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async blockUser(req: Request, res: Response) {
        try {
            let userId = req.params.id;
            console.log('userid' + userId)
            let blocked = await this.usecase.blockUser(userId);
            if (blocked) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, message: "Internal server error" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getProfessionals(req: Request, res: Response) {
        try {
            let page = req.query.page || 1;
            let limit = parseInt(req.query.limit as string);

            let profs = await this.usecase.getProfessionals(page as number, limit);
            if (profs) {
                res.status(200).json({ success: true, profs: profs.professionals, total: profs.total })
            } else {
                res.status(200).json({ success: false, message: "Internal server error" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async blockProfessional(req: Request, res: Response) {
        try {
            let profId = req.params.id;
            let blocked = await this.usecase.blockProfessional(profId);
            if (blocked) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async addCategory(req: Request, res: Response) {
        try {
            let category = req.body.name;
            let image = req.file;
            let savedData = await this.usecase.addCategory(category, image);
            if (savedData.success) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: savedData.message })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error!" })
        }
    }

    async editCategory(req: Request, res: Response) {
        try {
            console.log('in editcategory controller')
            let { id, name } = req.body;
            let image = req.file;
            console.log(id, name, image)
            let result = await this.usecase.editCategory(id, name, image);
            if (result.success) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: result.message });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async addJobrole(req: Request, res: Response) {
        try {
            let name = req.body.name;
            console.log(name)
            let savedData = await this.usecase.addJobrole(name);
            if (savedData.success) {
                res.status(200).json({ success: true });
            } else if (!savedData.success) {
                res.status(500).json({ success: false, message: savedData.message })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error!" })
        }
    }

    async getCategory(req: Request, res: Response) {
        try {
            const categories = await this.usecase.getCategory();
            res.status(200).json({ success: true, categories });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async getJobrole(req: Request, res: Response) {
        try {
            const jobroles = await this.usecase.getJobrole();
            res.status(200).json({ success: true, jobroles });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async deleteJobrole(req: Request, res: Response) {
        try {
            let id = req.params.id;
            console.log(id)
            let deleted = await this.usecase.deleteJobrole(id);
            if (deleted) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Something went wrong!' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async editJobrole(req: Request, res: Response) {
        try {
            let { id, name } = req.body;
            let saved = await this.usecase.editJobrole(id, name);
            if (saved.success) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: saved.message })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: err });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('adminToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true })
        } catch (err) {
            console.log(err);

        }
    }

    async getSubscriptions(req: Request, res: Response) {
        try {
            const subscriptions = await this.usecase.getSubscriptions();
            res.status(200).json({ success: true, subscriptions });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getASubscription(req: Request, res: Response) {
        let id = req.params.id;
        try {
            const subscription = await this.usecase.getASubscription(id);
            res.status(200).json({ success: true, subscription });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

export default AdminController;