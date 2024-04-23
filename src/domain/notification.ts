interface Notification{
    userId:string,
    message:string,
    createdAt:Date,
    readStatus:Boolean
    category:string
}

export default Notification;