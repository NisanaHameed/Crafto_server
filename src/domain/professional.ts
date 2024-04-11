import { ObjectId } from "mongoose";

interface Professional{
    id?:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    city:string,
    job:string,
    experience:number,
    company:string,
    bio:string,
    image:String,
    followers:[string],
    isBlocked: boolean
}

export default Professional;