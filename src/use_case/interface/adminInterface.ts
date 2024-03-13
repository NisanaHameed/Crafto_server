import Admin from "../../domain/admin"
import Professional from "../../domain/professional";
import User from "../../domain/user";

interface AdminInterface{
    findAdminByEmail(email:string):Promise<Admin | null>
    getUsers():Promise<User | null>
    blockUser(id:string):Promise<boolean>
    getProfessionals():Promise<Professional>
    blockProfessional(is:string):Promise<boolean>
}

export default AdminInterface;