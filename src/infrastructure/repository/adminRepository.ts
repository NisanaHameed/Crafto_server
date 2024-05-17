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
import Subscription from "../../domain/subscription";
import subscriptionModel from "../database/subscriptionModel";

interface Iprof {
    professionals: Professional,
    total: number
}
interface IUser {
    users: User,
    total: number
}

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
    async getUsers(page: number, limit: number): Promise<IUser> {
        try {
            let skipIndex = (page - 1) * limit;
            let users: any = await UserModel.find()
                .limit(limit)
                .skip(skipIndex)
            const total = await UserModel.countDocuments();
            return { users, total };
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
    async getProfessionals(page: number, limit: number): Promise<Iprof> {
        try {
            let skipIndex = (page - 1) * limit;
            let professionals: any = await ProfModel.find()
                .limit(limit)
                .skip(skipIndex)
            const total = await ProfModel.countDocuments();
            return { professionals, total };
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
    async findCategory(name: string): Promise<Category | null> {
        try {
            let category = await CategoryModel.findOne({ name: { $regex: name, $options: 'i' } });
            return category;
        } catch (err) {
            throw new Error('Failed to find category');
        }
    }

    async editCategory(id: string, name: string, image: string): Promise<boolean> {
        try {
            let edited = await CategoryModel.updateOne({ _id: id }, { $set: { name: name } });
            return edited.acknowledged;
        } catch (err) {
            throw new Error('Failed to edit category!');
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

    async findJobrole(name: string): Promise<Jobrole | null> {
        try {
            let jobrole = await JobroleModel.findOne({ name: { $regex: name, $options: 'i' } });
            return jobrole;
        } catch (err) {
            throw new Error('Failed to find job role');
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
            return res.deletedCount == 1;
        } catch (err) {
            throw new Error('Failed to delete jobrole!')
        }
    }

    async editJobrole(id: string, name: string): Promise<Boolean> {
        try {
            const res = await JobroleModel.updateOne({ _id: id }, { $set: { name: name } });
            console.log(res);
            return (res ? true : false);
        } catch (err) {
            throw new Error('Failed to edit jobrole!');
        }
    }

    async getSubscriptions(): Promise<Subscription | null> {
        try {
            const data: any = await subscriptionModel.find().populate('profId');
            return data;
        } catch (err) {
            throw new Error('Failed to fetch subscriptions');
        }
    }

    async getASubscription(id: string): Promise<Subscription | null> {
        try {
            const data = await subscriptionModel.findOne({ profId: id }).populate('profId');
            return data;
        } catch (err) {
            throw new Error('Failed to fetch subscription');
        }
    }

    async getDashboardDetails(): Promise<Object> {
        try {
            const unblockedUsers = await UserModel.countDocuments({ isBlocked: false });
            const blockedUsers = await UserModel.countDocuments({ isBlocked: true });
            const unblockedProfs = await ProfModel.countDocuments({ isBlocked: false });
            const blockedProfs = await ProfModel.countDocuments({ isBlocked: true });
            const activeSubscriptions = await subscriptionModel.countDocuments({ status: 'Active' });
            const cancelledSubscriptions = await subscriptionModel.countDocuments({ status: 'Cancelled' });
            return { unblockedUsers, blockedUsers, unblockedProfs, blockedProfs, activeSubscriptions, cancelledSubscriptions }
        } catch (err) {
            throw new Error('Failed to fetch data!');
        }
    }

}

export default AdminRepository;