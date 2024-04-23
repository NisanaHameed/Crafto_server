import { Request, Response } from 'express';
import RequirementUsecase from "../../use_case/requirementUsecase";
import IRequirement from "../../domain/requirement";

class RequirementController {

    private usecase: RequirementUsecase;
    constructor(usecase: RequirementUsecase) {
        this.usecase = usecase;
    }

    async saveRequirement(req: Request, res: Response) {
        try {
            let id = req.userId;
            let reqs = req.body;
            reqs.userId = id;
            reqs.createdAt = Date.now();
            let result = await this.usecase.saveReq(reqs);
            console.log(result);
            if (result) {
                res.status(200).json({ success: true, requirement: result });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async getRequirements(req: Request, res: Response) {
        try {
            let userId = req.userId;
            let reqs = await this.usecase.getRequirements(userId as string);
            res.status(200).json({ success: true, reqs });
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async updateRequirement(req: Request, res: Response) {
        try {
            let id = req.body.id;
            let status = req.body.status;
            let edited = await this.usecase.updateReq(id, status);
            if (edited) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Failed to update requirement!' });
            }

        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async getRequirementsByService(req: Request, res: Response) {
        try {
            let profId = req.profId;
            const requirements = await this.usecase.getRequirementsByService(profId as string);
            res.status(200).json({ success: true, requirements });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
}

export default RequirementController;