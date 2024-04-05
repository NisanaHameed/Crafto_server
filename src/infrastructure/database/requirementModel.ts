import mongoose, { Schema, mongo } from "mongoose";
import IRequirement from "../../domain/requirement";

const requirementSchema:Schema<IRequirement> = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    area:{
        type:String,
        required:true
    },
    budget:{
        type:String,
        required:true
    },
    workPeriod:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    type:{
        type:String
    },
    rooms:{
        type:String
    },
    scope:{
        type:String
    },
    plan:{
        type:String
    },
    status:{
        type:String,
        default:'active'
    }
})

const RequirementModel = mongoose.model('Requirement',requirementSchema);
export default RequirementModel;
