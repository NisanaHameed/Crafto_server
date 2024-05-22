import IRequirement from "../../domain/requirement";
import IRequirementRepository from "../../use_case/interface/IRequirementRepository";
import RequirementModel from "../database/requirementModel";
import notificationModel from "../database/notificationModel";
import ProfModel from "../database/profModel";

class RequirementRepository implements IRequirementRepository {

    async saveRequirement(requirement: IRequirement): Promise<IRequirement> {
        try {
            const newReq: any = new RequirementModel(requirement);
            let job;
            if (requirement.service === 'Home construction') {
                job = 'Constructor';
            } else if (requirement.service === 'Interior design') {
                job = 'Interior Designer';
            } else if (requirement.service === 'House plan') {
                job = 'Architect'
            }
            const professionals = await ProfModel.find({ job: job, isVerified: true });
            const notifications = professionals.map(prof => {
                return new notificationModel({
                    userId: prof._id,
                    message: 'You have a new requirement, check the details!',
                    createdAt: Date.now(),
                    category: 'Requirement'
                })
            })

            await notificationModel.insertMany(notifications);
            await newReq.save();
            return newReq
        } catch (err) {
            throw new Error('Failed to save requirement')
        }
    }

    async getRequirements(userId: string): Promise<IRequirement | null> {
        try {
            let res: any = await RequirementModel.find({ userId: userId }).sort({ createdAt: -1 });
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

    async getRequirementsByService(profId: string): Promise<IRequirement | null> {
        try {
            const prof = await ProfModel.findOne({ _id: profId });
            let service;
            if (prof?.job == 'Architect') {
                service = 'House plan'
            } else if (prof?.job == 'Interior Designer') {
                service = 'Interior design'
            } else if (prof?.job == 'Constructor') {
                service = 'Home construction'
            }
            const requirements: any = await RequirementModel.find({ service: service }).sort({ createdAt: -1 });
            return requirements;
        } catch (err) {
            throw new Error('Failed to fetch requirements!');
        }


    }
}

export default RequirementRepository;