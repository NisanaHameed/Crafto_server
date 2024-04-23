import { ObjectId } from "mongoose"

interface IRequirement{
    userId:ObjectId,
    area:string,
    budget:string,
    workPeriod:string,
    service:string,
    rooms?:string,
    type?:string,
    scope?:string,
    plan?:string,
    status?:string,
    createdAt:Date
}
export default IRequirement;