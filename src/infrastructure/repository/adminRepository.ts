import Admin from "../../domain/admin";
import Professional from "../../domain/professional";
import User from "../../domain/user";
import AdminInterface from "../../use_case/interface/IAdminInterface";
import AdminModel from "../database/adminModel";
import ProfModel from "../database/profModel";
import UserModel from "../database/userModel";
import CategoryModel from "../database/categoryModel";
import Jobrole from "../../domain/jobRole";
import JobroleModel from "../database/jobroleModel";
import Category from "../../domain/category";

class AdminRepository implements AdminInterface {
    async findAdminByEmail(email: string): Promise<Admin | null> {
        try {
            let admindata = await AdminModel.findOne({ email: email });
            return admindata;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find admin by email")
        }
    }
    async getUsers(): Promise<User | null> {
        try {
            let users: any = await UserModel.find();
            return users;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to fetch users")
        }

    }
    async blockUser(id: string): Promise<boolean> {
        try {
            console.log('id' + id);

            let user = await UserModel.findById(id);
            console.log('user' + user)
            if (user) {
                await UserModel.findByIdAndUpdate(id, { $set: { isBlocked: !user.isBlocked } })
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            throw new Error("Failed to block user")
        }
    }
    async getProfessionals(): Promise<Professional> {
        try {
            let professionals: any = await ProfModel.find();
            return professionals;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to fetch users")
        }
    }
    async blockProfessional(id: string): Promise<boolean> {
        try {
            let prof = await ProfModel.findById(id);
            if (prof) {
                await ProfModel.findByIdAndUpdate(id, { $set: { isBlocked: !prof.isBlocked } })
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            throw new Error("Failed to block user")
        }
    }
    async saveCategory(name: string, image: string): Promise<Boolean> {
        try {
            let newData = new CategoryModel({
                name: name,
                image: image
            })
            await newData.save();
            return newData ? true : false;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to save category")
        }
    }
    async saveJobrole(name: string): Promise<Boolean> {
        try {
            let newData = new JobroleModel({ name: name });
            await newData.save();
            return newData ? true : false;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to save category")
        }
    }

    async getCategory(): Promise<Category | null> {
        try {
            const categories: any = await CategoryModel.find();
            return categories;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to fetch categories')
        }
    }

    async getJobrole(): Promise<Jobrole | null> {
        try {
            const jobrole: any = await JobroleModel.find();
            return jobrole;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to fetch jobroles!')
        }
    }

    async deleteJobrole(id: string): Promise<Boolean> {
        try {
            const res = await JobroleModel.deleteOne({ _id: id });
            console.log(res)
            return res.deletedCount==1;
        } catch (err) {
            throw new Error('Failed to delete jobrole!')
        }
    }

    async editJobrole(id: string,name:string): Promise<Boolean> {
        try{
            const res = await JobroleModel.updateOne({_id:id},{$set:{name:name}});
            console.log(res);
            return (res? true:false);
        }catch(err){
            throw new Error('Failed to edit jobrole!');
        }
    }

}

export default AdminRepository;