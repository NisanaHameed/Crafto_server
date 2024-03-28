import profInterface from "../../use_case/interface/IProfInterface";
import ProfModel from "../database/profModel";
import Professional from "../../domain/professional";

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
            let data = await ProfModel.findById(id);
            return data;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find data by id")
        }
    }
    async updateProfile(id: string, editeddata: Professional): Promise<boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, editeddata, { new: true });
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update data")
        }
    }
    async updateImage(id: string, image: string): Promise<Boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, { $set: { image: image } }, { new: true })
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update image")
        }
    }

    async updateEmail(id: string, email: string): Promise<Boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, { $set: { email: email } }, { new: true })
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update email")
        }
    }

    async updatePassword(id: string, password: string): Promise<Boolean> {
        try {
            let data = await ProfModel.updateOne({ _id: id }, { $set: { password: password } }, { new: true })
            return data.acknowledged;
        } catch (err) {
            console.log(err);
            throw new Error("Failed to update password")
        }
    }
}

export default ProfRepository;