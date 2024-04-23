import IRequirement from "../../domain/requirement";

interface IRequirementRepository {
    saveRequirement(requirement: IRequirement): Promise<IRequirement | null>
    getRequirements(userId: string): Promise<IRequirement | null>
    updateRequirement(userId: string, status: string): Promise<Boolean>
    getRequirementsByService(profId: string): Promise<IRequirement | null>
}

export default IRequirementRepository;