import nodemailer from 'nodemailer'
import nodemailerInterface from '../../use_case/interface/INodemailerInterface'
import dotenv from 'dotenv'
dotenv.config();

class SendMail implements nodemailerInterface{

    private transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:'nisana1994@gmail.com',
                pass:process.env.gmail_password
            }
        })
    }
    async sendMail(to: string, otp: string): Promise<any> {
        const mailOptions = {
            from: 'nisana1994@gmail.com',
            to,
            subject: 'CRAFTO - OTP for Email Verification',
            text: `Your OTP for email verification is ${otp}`
        }
        
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('OTP sent successfully!')
            }
        });

       
    }
}

export default SendMail;