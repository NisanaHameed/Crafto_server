import User from "../../domain/user"
interface UserInterface {
    findByEmail(email: string): Promise<User | null>,
    saveUser(user: User): Promise<User | null>,
    findUserById(id:string): Promise<User | null>,
    updateUser(id:string,user:User):Promise<boolean>
}

export default UserInterface;