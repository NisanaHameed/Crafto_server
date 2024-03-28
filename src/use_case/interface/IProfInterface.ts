import Professional from "../../domain/professional";

interface IProfInterface {
    findByEmail(email: string): Promise<Professional | null>,
    saveProfessional(prof: Professional): Promise<Professional | null>,
    findProfById(id: string): Promise<Professional | null>,
    updateProfile(id:string,prof:Professional):Promise<boolean>
    updateImage(id:string,image:string):Promise<Boolean>
    updateEmail(id:string,email:string):Promise<Boolean>
    updatePassword(id:string,password:string):Promise<Boolean>
}

export default IProfInterface;