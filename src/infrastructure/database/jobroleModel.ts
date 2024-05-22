import Jobrole from "../../domain/jobRole";
import mongoose, { Schema } from "mongoose";

const JobroleSchema: Schema<Jobrole> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const JobroleModel = mongoose.model<Jobrole>('Jobrole', JobroleSchema);
export default JobroleModel;