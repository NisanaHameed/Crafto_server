interface INodemailerInterface {
    sendMail(to: string, otp: string): Promise<any>
}

export default INodemailerInterface;