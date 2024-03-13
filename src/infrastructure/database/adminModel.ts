import mongoose,{Document,Schema} from 'mongoose'
import Admin from '../../domain/admin';

// interface Admin extends Document{
//     email:string,
//     password:string
// }

const adminShema : Schema<Admin> = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const adminModel = mongoose.model<Admin>('Admin',adminShema);
export default adminModel;