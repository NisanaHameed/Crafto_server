import User from "../../domain/user"
interface IUserInterface {
    findByEmail(email: string): Promise<User | null>,
    saveUser(user: User): Promise<User | null>,
    findUserById(id: string): Promise<User | null>,
    updateUser(id: string, user: User): Promise<boolean>
    followProfessional(profId: string, userId: string): Promise<Boolean>
    unfollowProf(profId: string, userId: string): Promise<Boolean>
    savePost(postId: string, userId: string, save: string): Promise<Boolean>
}

export default IUserInterface;