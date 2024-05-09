import User from "../../domain/user";
import userInterface from "../../use_case/interface/IUserInterface";
import UserModel from '../database/userModel'
import ProfModel from "../database/profModel";
import postModel from "../database/postModel";

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
            let userdata: User | null = await UserModel.findById(id).populate({
                path: 'savedPosts',
                populate: { path: 'profId' }
            });
            return userdata
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find user")
        }
    }
    async updateUser(id: string, userdata: User): Promise<boolean> {
        try {
            let updatedUser = await UserModel.updateOne({ _id: id }, userdata, { new: true });
            console.log(updatedUser)
            return updatedUser.acknowledged
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update user")
        }
    }

    async followProfessional(profId: string, userId: string): Promise<Boolean> {
        try {
            const followed = await ProfModel.updateOne({ _id: profId }, { $addToSet: { followers: userId } });
            return followed.acknowledged;
        } catch (err) {
            throw new Error('Failed to follow');
        }
    }

    async unfollowProf(profId: string, userId: string) {
        try {
            const unfollowed = await ProfModel.updateOne({ _id: profId }, { $pull: { followers: userId } });
            return unfollowed.acknowledged
        } catch (err) {
            throw new Error('failed to unfollow');
        }
    }

    async savePost(postId: string, userId: string, save: string): Promise<Boolean> {
        try {
            let saved = false;
            if (save === 'true') {
                const [savedUserIdInPost, savedInUser] = await Promise.all([
                    postModel.updateOne({ _id: postId }, { $addToSet: { saved: userId } }),
                    UserModel.updateOne({ _id: userId }, { $addToSet: { savedPosts: postId } })
                ])
                saved = savedUserIdInPost.acknowledged && savedInUser.acknowledged;
            } else {
                const [unsavedUserIdInPost, unsavedInUser] = await Promise.all([
                    postModel.updateOne({ _id: postId }, { $pull: { saved: userId } }),
                    UserModel.updateOne({ _id: userId }, { $pull: { savedPosts: postId } })
                ])
                saved = unsavedUserIdInPost.acknowledged && unsavedInUser.acknowledged;
            }
            return saved;
        } catch (err) {
            throw new Error('Failed to save post!');
        }
    }

    async changePassword(email: string, password: string): Promise<boolean> {
        try {
            let result = await UserModel.updateOne({ email: email }, { $set: { password: password } });
            console.log(result)
            return result.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error('failed to update password!');
        }
    }

}

export default UserRepository;