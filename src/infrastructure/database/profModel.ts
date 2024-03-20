import mongoose,{Document,Schema} from 'mongoose'
import Professional from '../../domain/professional'

const ProfSchema:Schema<Professional> = new mongoose.Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    city:{
        type:String
    },
    job:{
        type:String
    },
    experience:{
        type:Number
    },
    company:{
        type:String
    },
    bio:{
        type:String
    },
    image:{
        type:String
    },
    followers:{
        type:Number
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
})

const ProfModel = mongoose.model<Professional>('Professional',ProfSchema);
export default ProfModel;