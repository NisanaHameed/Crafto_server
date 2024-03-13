interface NodemailerInterface{
    sendMail(to:string,otp:string):Promise<any>
}

export default NodemailerInterface;