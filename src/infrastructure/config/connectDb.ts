import mongoose from 'mongoose'

export const connectDb = async() =>{
    try{
        const mongo_url = process.env.MONGO_URL as string
        await mongoose.connect(mongo_url)
        console.log('connected to database');
        
    }catch(err){
        console.log(err);
        console.log('Database is not connected!')
    }
}