import profInterface from "../../use_case/interface/IProfInterface";
import ProfModel from "../database/profModel";
import Professional from "../../domain/professional";
import postModel from "../database/postModel";
import Subscription from "../../domain/subscription";
import subscriptionModel from "../database/subscriptionModel";

class ProfRepository implements profInterface {
    async findByEmail(email: string): Promise<Professional | null> {
        try {
            let data = await ProfModel.findOne({ email: email })
            return data
        } catch (err) {
            console.log(err);
            throw new Error("Failed to fetch data by email")
        }
    }
    async saveProfessional(prof: Professional): Promise<Professional | null> {
        try {
            let newProf = new ProfModel(prof);
            await newProf.save();
            return newProf;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to save data")
        }
    }
    async findProfById(id: string): Promise<Professional | null> {
        try {
            let data = await ProfModel.findById(id).populate({
                path: 'savedPosts',
                populate: { path: 'profId' }
            });
            return data;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find data by id")
        }
    }
    async updateProfile(id: string, editeddata: Professional): Promise<boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, { $set: editeddata });
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update data")
        }
    }
    async updateImage(id: string, image: string): Promise<boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, { $set: { image: image } })
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update image")
        }
    }

    async updateEmail(id: string, email: string): Promise<boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, { $set: { email: email } })
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update email")
        }
    }

    async updatePassword(id: string, password: string): Promise<boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, { $set: { password: password } }, { new: true })
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update password")
        }
    }

    async findProfessionals(id: string): Promise<Professional | null> {
        try {
            let profs: any = await ProfModel.find({ _id: { $ne: id } });
            return profs;
        } catch (err) {
            throw new Error('Failed to fetch professionals!');
        }
    }

    async savePost(postId: string, profId: string, save: string): Promise<boolean> {
        try {
            let saved = false;
            if (save === 'true') {
                const [savedUserIdInPost, savedInUser] = await Promise.all([
                    postModel.updateOne({ _id: postId }, { $addToSet: { saved: profId } }),
                    ProfModel.updateOne({ _id: profId }, { $addToSet: { savedPosts: postId } })
                ])
                saved = savedUserIdInPost.acknowledged && savedInUser.acknowledged;
            } else {
                const [unsavedUserIdInPost, unsavedInUser] = await Promise.all([
                    postModel.updateOne({ _id: postId }, { $pull: { saved: profId } }),
                    ProfModel.updateOne({ _id: profId }, { $pull: { savedPosts: postId } })
                ])
                saved = unsavedUserIdInPost.acknowledged && unsavedInUser.acknowledged;
            }
            return saved;
        } catch (err) {
            throw new Error('Failed to save post!');
        }
    }

    async updateIsVerified(profId: string): Promise<boolean> {
        try {

            const prof = await ProfModel.findOneAndUpdate({ _id: profId }, { $set: { isVerified: false }, $unset: { subscriptionID: 1 } }, { new: true });
            console.log(prof)
            return (prof ? true : false);
        } catch (err) {
            throw new Error('Failed to update isVerified');
        }
    }

    async createSubscription(data: Subscription): Promise<boolean> {
        try {
            const newSubscription = new subscriptionModel(data);
            await newSubscription.save();
            console.log('newSubscription',newSubscription)
            return (newSubscription ? true : false);
        } catch (err) {
            throw new Error('Failed to create subscription');
        }
    }

    async updateSubscription(profId: string, subscriptionID: string): Promise<boolean> {
        try {
            let updated;
            if (!subscriptionID.length) {
                updated = await subscriptionModel.updateOne({ profId: profId }, { $set: { status: 'Cancelled' } });
            } else {
                updated = await subscriptionModel.updateOne({ subscriptionId: subscriptionID }, { $set: { profId: profId } }, { upsert: true });
            }
            return updated.acknowledged;
        } catch (err) {
            throw new Error('Failed to update subscription');
        }
    }
}

export default ProfRepository;