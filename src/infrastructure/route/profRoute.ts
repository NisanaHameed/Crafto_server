import express from "express";
import ProfController from "../../adaptors/controllers/professionalController";
import ProfUsecase from "../../use_case/profUsecase";
import ProfRepository from "../repository/profRepository";
import GenerateOTP from "../utils/otpGenerator";
import SendMail from "../utils/sendMail";
import HashPassword from "../utils/hashPassword";
import JWT from "../utils/jwt";
import Cloudinary from "../utils/cloudinary";
import authenticate from "../middleware/profAuth";

const jwt = new JWT();
const hash = new HashPassword();
const sendMail = new SendMail();
const otp = new GenerateOTP();
const repository = new ProfRepository();
const cloudinary = new Cloudinary();
import {uploadFile} from "../middleware/multer";

const useCase = new ProfUsecase(repository,otp,sendMail,hash,jwt,cloudinary);
const controller = new ProfController(useCase);

const router = express.Router();

router.post('/signup',(req,res)=>controller.signup(req,res));
router.post('/verifyotp',(req,res)=>controller.verifyOTP(req,res));
router.post('/fillProfile',uploadFile.single('image'),(req,res)=>controller.fillProfile(req,res));
router.post('/gsignup',(req,res)=>controller.gsignup(req,res));
router.post('/login',(req,res)=>controller.login(req,res));
router.get('/profile',authenticate,(req,res)=>controller.getProfile(req,res));
router.patch('/editProfile',authenticate,(req,res)=>controller.editProfile(req,res));
router.patch('/editImage',authenticate,uploadFile.single('image'),(req,res)=>controller.editImage(req,res));
router.patch('/editEmail',authenticate,(req,res)=>controller.editEmail(req,res));
router.patch('/editPassword',authenticate,(req,res)=>controller.editPassword(req,res));
router.get('/logout',(req,res)=>controller.logout(req,res));

export default router;