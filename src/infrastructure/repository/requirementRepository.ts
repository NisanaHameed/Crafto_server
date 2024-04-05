import IRequirement from "../../domain/requirement";
import IRequirementRepository from "../../use_case/interface/IReuirementRepository";
import RequirementModel from "../database/requirementModel";

class RequirementRepository implements IRequirementRepository {

    async saveRequirement(requirement: IRequirement): Promise<Boolean> {
        try {
            const newReq = new RequirementModel(requirement);
            console.log(newReq);
            await newReq.save();
            return (newReq ? true : false);
        } catch (err) {
            throw new Error('Failed to save requirement')
        }
    }

    async getRequirements(userId: string): Promise<IRequirement | null> {
        try {
            let res: any = await RequirementModel.find({ userId: userId });
            return res;
        } catch (err) {
            throw new Error('Failed to fetch requirements');
        }
    }

    async updateRequirement(id: string, status: string): Promise<Boolean> {
        try {
            let res = await RequirementModel.updateOne({ _id: id }, { $set: { status: status } });
            return res.acknowledged;
        } catch (err) {
            throw new Error('Failed to update requirement');
        }
    }
}

export default RequirementRepository;