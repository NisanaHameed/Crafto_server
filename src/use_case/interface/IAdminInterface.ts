import Admin from "../../domain/admin"
import Professional from "../../domain/professional";
import User from "../../domain/user";
import Category from "../../domain/category";
import Jobrole from "../../domain/jobRole";
import Subscription from "../../domain/subscription";

interface Iprof{
    professionals:Professional,
    total:number
}
interface IUser{
    users:User,
    total:number
}
interface IAdminInterface {
    findAdminByEmail(email: string): Promise<Admin | null>
    getUsers(page:number,limit:number): Promise<IUser>
    blockUser(id: string): Promise<boolean>
    getProfessionals(page:number,limit:number): Promise<Iprof>
    blockProfessional(is: string): Promise<boolean>
    saveCategory(name: string, image: string): Promise<Boolean>
    findCategory(name: string): Promise<Category | null>
    editCategory(id: string, name: string, image: string): Promise<boolean>
    saveJobrole(name: string): Promise<Boolean>
    findJobrole(name: string): Promise<Jobrole | null>
    getCategory(): Promise<Category | null>
    getJobrole(): Promise<Jobrole | null>
    deleteJobrole(id: string): Promise<Boolean>
    editJobrole(id: string, name: string): Promise<Boolean>
    getSubscriptions(): Promise<Subscription | null>
    getASubscription(id: string): Promise<Subscription | null>
    getDashboardDetails(): Promise<Object>
}

export default IAdminInterface;