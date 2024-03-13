import Professional from "../../domain/professional";

interface ProfInterface {
    findByEmail(email: string): Promise<Professional | null>,
    saveProfessional(prof: Professional): Promise<Professional | null>,
    findProfById(id: string): Promise<Professional | null>,
    updateProfile(id:string,prof:Professional):Promise<boolean>
}

export default ProfInterface;