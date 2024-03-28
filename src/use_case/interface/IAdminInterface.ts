import Admin from "../../domain/admin"
import Professional from "../../domain/professional";
import User from "../../domain/user";
import Category from "../../domain/category";
import Jobrole from "../../domain/jobRole";

interface IAdminInterface{
    findAdminByEmail(email:string):Promise<Admin | null>
    getUsers():Promise<User | null>
    blockUser(id:string):Promise<boolean>
    getProfessionals():Promise<Professional>
    blockProfessional(is:string):Promise<boolean>
    saveCategory(name:string,image:string):Promise<Boolean>
    saveJobrole(name:string):Promise<Boolean>
    getCategory():Promise<Category | null>
    getJobrole():Promise<Jobrole | null>
    deleteJobrole(id:string):Promise<Boolean>
    editJobrole(id:string,name:string):Promise<Boolean>
}

export default IAdminInterface;