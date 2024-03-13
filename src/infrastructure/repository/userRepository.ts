import User from "../../domain/user";
import userInterface from "../../use_case/interface/userInterface";
import UserModel from '../database/userModel'

class UserRepository implements userInterface {

    async findByEmail(email: string): Promise<User | null> {
        try {
            let userCheck = await UserModel.findOne({ email: email });
            return userCheck ? userCheck.toObject() : null;
        } catch (err) {
            console.error(`Error in findByEmail for email ${email}:`, err);
            throw new Error('Failed to fetch user by email');
        }
    }
    async saveUser(user: User): Promise<User | null> {
        try {
            let newUser = new UserModel(user);
            await newUser.save();
            return newUser ? newUser.toObject() : null;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to save user');
        }
    }
    async findUserById(id: string): Promise<User | null> {
        try {
            let userdata: User | null = await UserModel.findById(id);
            return userdata
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find user")
        }
    }
    async updateUser(id: string, userdata: User): Promise<boolean> {
        try {
            let updatedUser = await UserModel.updateOne({ _id: id }, userdata, { new: true });
            if (updatedUser) {
                return true
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update user")
        }
    }

}

export default UserRepository;