"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SendMail {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'nisana1994@gmail.com',
                pass: process.env.GMAIL_PASSWORD
            }
        });
    }
    sendMail(to, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: 'nisana1994@gmail.com',
                to,
                subject: 'CRAFTO - OTP for Email Verification',
                text: `Your OTP for email verification is ${otp}`
            };
            this.transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('OTP sent successfully!');
                }
            });
        });
    }
}
exports.default = SendMail;
