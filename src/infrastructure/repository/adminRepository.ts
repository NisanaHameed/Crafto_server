import Admin from "../../domain/admin";
import Professional from "../../domain/professional";
import User from "../../domain/user";
import AdminInterface from "../../use_case/interface/IAdminInterface";
import AdminModel from "../database/adminModel";
import ProfModel from "../database/profModel";
import UserModel from "../database/userModel";

class AdminRepository implements AdminInterface{
    async findAdminByEmail(email: string): Promise<Admin | null> {
        try{
            let admindata = await AdminModel.findOne({email:email});
            return admindata;
        }catch(err){
            console.log(err);
            throw new Error("Failed to find admin by email")
        }
    }
    async getUsers(): Promise<User | null> {
        try{
            let users:any = await UserModel.find();
            return users;
        }catch(err){
            console.log(err);
            throw new Error("Failed to fetch users")
        }
        
    }
    async blockUser(id: string): Promise<boolean> {
        try{
            console.log('id'+id);
            
            let user = await UserModel.findById(id);
            console.log('user'+user)
            if(user){
                await UserModel.findByIdAndUpdate(id,{$set:{isBlocked:!user.isBlocked}})
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log(err);
            throw new Error("Failed to block user")
        }
    }
    async getProfessionals(): Promise<Professional> {
        try{
            let professionals:any = await ProfModel.find();
            return professionals;
        }catch(err){
            console.log(err);
            throw new Error("Failed to fetch users")
        }
    }
    async blockProfessional(id: string): Promise<boolean> {
        try{
            let prof = await ProfModel.findById(id);
            if(prof){
                await ProfModel.findByIdAndUpdate(id,{$set:{isBlocked:!prof.isBlocked}})
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log(err);
            throw new Error("Failed to block user")
        }
    }
}

export default AdminRepository;