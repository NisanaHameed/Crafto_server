import IRequirement from "../../domain/requirement";

interface IRequirementRepository {
    saveRequirement(requirement: IRequirement): Promise<Boolean>
    getRequirements(userId: string): Promise<IRequirement | null>
    updateRequirement(userId: string, status: string): Promise<Boolean>
}

export default IRequirementRepository;