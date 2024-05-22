import Professional from "../../domain/professional";
import Subscription from "../../domain/subscription";

interface IProfInterface {
    findByEmail(email: string): Promise<Professional | null>,
    saveProfessional(prof: Professional): Promise<Professional | null>,
    findProfById(id: string): Promise<Professional | null>,
    updateProfile(id: string, prof: Professional): Promise<boolean>
    updateImage(id: string, image: string): Promise<boolean>
    updateEmail(id: string, email: string): Promise<boolean>
    updatePassword(id: string, password: string): Promise<boolean>
    findProfessionals(id: string): Promise<Professional | null>
    savePost(postId: string, profId: string, save: string): Promise<boolean>
    updateIsVerified(profId: string, isVerified: boolean): Promise<boolean>
    createSubscription(data: Subscription): Promise<boolean>
    updateSubscription(profId: string, subscriptionID: string): Promise<boolean>
    changePassword(email: string, password: string): Promise<boolean>
}

export default IProfInterface;