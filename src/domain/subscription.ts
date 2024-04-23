interface IPlan{
    planType:string;
    amount:number;
}
interface Subscription{
    profId?:string
    subscriptionId:string
    plan:IPlan
    status:string
    startDate:Date
    endDate:Date
    createdAt:Date
}

export default Subscription;