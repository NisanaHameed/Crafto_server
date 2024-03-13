import profInterface from "../../use_case/interface/profInterface";
import ProfModel from "../database/profModel";
import Professional from "../../domain/professional";

class ProfRepository implements profInterface{
    async findByEmail(email: string): Promise<Professional | null> {
        try{
            let data = await ProfModel.findOne({email:email})
            return data
        }catch(err){
            console.log(err);
            throw new Error("Failed to fetch data by email")
        }
    }
    async saveProfessional(prof: Professional): Promise<Professional|null> {
        try{
            let newProf = new ProfModel(prof);
            await newProf.save();
            return newProf;
        }catch(err){
            console.log(err);
            throw new Error("Failed to save data")
        }
    }
    async findProfById(id: string): Promise<Professional | null> {
        try{
            let data = await ProfModel.findById(id);
            return data;
        }catch(err){
            console.log(err);
            throw new Error("Failed to find data by id")
        }
    }
    async updateProfile(id:string,editeddata: Professional): Promise<boolean> {
        try{
            let data = await ProfModel.findByIdAndUpdate(id,editeddata,{new:true});
            if(data){
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log(err);
            throw new Error("Failed to update data")
        }
    }
}

export default ProfRepository;