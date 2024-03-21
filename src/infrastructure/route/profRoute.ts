import express from "express";
import ProfController from "../../adaptors/controllers/professionalController";
import ProfUsecase from "../../use_case/profUsecase";
import ProfRepository from "../repository/profRepository";
import GenerateOTP from "../utils/otpGenerator";
import SendMail from "../utils/sendMail";
import HashPassword from "../utils/hashPassword";
import JWT from "../utils/jwt";
import authenticate from "../middleware/profAuth";

const jwt = new JWT();
const hash = new HashPassword();
const sendMail = new SendMail();
const otp = new GenerateOTP();
const repository = new ProfRepository();
import {uploadFile} from "../middleware/multer";

const useCase = new ProfUsecase(repository,otp,sendMail,hash,jwt);
const controller = new ProfController(useCase);

const router = express.Router();

router.post('/signup',(req,res)=>controller.signup(req,res));
router.post('/verifyotp',(req,res)=>controller.verifyOTP(req,res));
router.post('/fillProfile',authenticate,uploadFile.single('image'),(req,res)=>controller.fillProfile(req,res));
router.post('/gsignup',(req,res)=>controller.gsignup(req,res));
router.post('/login',(req,res)=>controller.login(req,res));
router.get('/profile',authenticate,(req,res)=>controller.getProfile(req,res));

export default router;