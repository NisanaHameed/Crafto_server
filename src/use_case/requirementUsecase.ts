import IRequirement from "../domain/requirement";
import IRequirementRepository from "./interface/IReuirementRepository";

class RequirementUsecase {

    repository: IRequirementRepository;

    constructor(repository: IRequirementRepository) {
        this.repository = repository;
    }

    async saveReq(reqrmnt: IRequirement) {
        try {
            let res = await this.repository.saveRequirement(reqrmnt);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async getRequirements(userId: string) {
        try {
            let res = await this.repository.getRequirements(userId);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async updateReq(id: string, status: string) {
        try {
            let res = await this.repository.updateRequirement(id, status);
            return res;
        } catch (err) {
            throw err;
        }
    }

    async getRequirementsByService(profId: string) {
        try {
            const requirements = await this.repository.getRequirementsByService(profId);
            return requirements;
        } catch (err) {
            throw err;
        }
    }
}

export default RequirementUsecase;