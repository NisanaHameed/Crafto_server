import express from "express";
import UserController from "../../adaptors/controllers/userController"
import Userusecase from "../../use_case/userUsecase";
import UserRepository from "../repository/userRepository";
import GenerateOTP from "../utils/otpGenerator";
import SendMail from "../utils/sendMail";
import HashPassword from "../utils/hashPassword";
import JWT from "../utils/jwt";
import authenticate from "../middleware/userAuth";
import {uploadFile} from '../middleware/multer'
import Cloudinary from "../utils/cloudinary";

const repository = new UserRepository();
const otp = new GenerateOTP();
const sendOtp = new SendMail();
const hash = new HashPassword();
const jwt = new JWT();
const cloudinary = new Cloudinary();

const useCase = new Userusecase(repository,otp,sendOtp,hash,jwt,cloudinary)
const controller = new UserController(useCase);

const router = express.Router();

router.post('/signup',(req,res)=>controller.signup(req,res));
router.post('/verifyotp',(req,res)=>controller.verifyOTP(req,res));
router.post('/login',(req,res)=>controller.login(req,res));
router.post('/gsignup',(req,res)=>controller.gsignup(req,res));
router.get('/profile',authenticate,(req,res)=>controller.getProfile(req,res));
router.patch('/editProfile',authenticate,uploadFile.single('image'),(req,res)=>controller.editProfile(req,res));
router.get('/logout',(req,res)=>controller.logout(req,res));

export default router;