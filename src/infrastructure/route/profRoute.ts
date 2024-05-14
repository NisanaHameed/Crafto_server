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
import PostController from "../../adaptors/controllers/postController";
import PostUsecase from "../../use_case/postUsecase";
import PostRepository from "../repository/postRepository";
import NotificationRepository from "../repository/notificationRepository";
import NotificationUsecase from "../../use_case/notificationUsecase";
import NotificationController from "../../adaptors/controllers/notificationController";
import RequirementController from "../../adaptors/controllers/requirementController";
import RequirementUsecase from "../../use_case/requirementUsecase";
import RequirementRepository from "../repository/requirementRepository";
import StripePayment from "../utils/stripe";

const jwt = new JWT();
const hash = new HashPassword();
const sendMail = new SendMail();
const otp = new GenerateOTP();
const repository = new ProfRepository();
const cloudinary = new Cloudinary();
const stripe = new StripePayment();
import { uploadFile } from "../middleware/multer";

const useCase = new ProfUsecase(repository, otp, sendMail, hash, jwt, cloudinary, stripe);
const controller = new ProfController(useCase);

const postRepository = new PostRepository();
const postUsecase = new PostUsecase(cloudinary, postRepository);
const postController = new PostController(postUsecase);

const notificationRepository = new NotificationRepository();
const notificationUsecase = new NotificationUsecase(notificationRepository);
const notificationController = new NotificationController(notificationUsecase);

const reqRepository = new RequirementRepository();
const reqUsecase = new RequirementUsecase(reqRepository);
const reqController = new RequirementController(reqUsecase);

const router = express.Router();

router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/verifyotp', (req, res) => controller.verifyOTP(req, res));
router.post('/fillProfile', uploadFile.single('image'), (req, res) => controller.fillProfile(req, res));
router.post('/gsignup', (req, res) => controller.gsignup(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.get('/profile', authenticate, (req, res) => controller.getProfile(req, res));
router.patch('/editProfile', authenticate, (req, res) => controller.editProfile(req, res));
router.patch('/editImage', authenticate, uploadFile.single('image'), (req, res) => controller.editImage(req, res));
router.post('/editEmail', authenticate, (req, res) => controller.editEmail(req, res));
router.put('/verifyEmailOtp', authenticate, (req, res) => controller.changeEmail_Otp(req, res));
router.patch('/editPassword', authenticate, (req, res) => controller.editPassword(req, res));
router.get('/professionals', authenticate, (req, res) => controller.getProfessionals(req, res));
router.get('/profDetails/:id', (req, res) => controller.getAProfessional(req, res));
router.patch('/savePost/:id/:save', authenticate, (req, res) => controller.savePost(req, res));
router.post('/subscribe/:plan', authenticate, (req, res) => controller.subscribe(req, res));
router.delete('/cancelSubscription', authenticate, (req, res) => controller.cancelSubscription(req, res));
router.post('/forgotPassword', (req, res) => controller.forgotPassword(req, res));
router.post('/verifyOtpForgotPassword', (req, res) => controller.verifyOtpForgotPassword(req, res));
router.post('/changePassword', (req, res) => controller.changePassword(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.get('/logout', (req, res) => controller.logout(req, res));

router.post('/createPost', authenticate, uploadFile.single('image'), (req, res) => postController.createPost(req, res));
router.get('/getPosts', authenticate, (req, res) => postController.getPost(req, res));
router.get('/designs/:category', (req, res) => postController.getDesigns(req, res));
router.get('/allDesigns', (req, res) => postController.getAllPosts(req, res));
router.get('/portraits', authenticate, (req, res) => postController.getPortraits(req, res));
router.get('/postsById/:id', (req, res) => postController.getPostsById(req, res));
router.put('/like/:id', authenticate, (req, res) => postController.likeByProf(req, res));
router.put('/unlike/:id', authenticate, (req, res) => postController.unlikeByProf(req, res))
router.put('/postComment', authenticate, (req, res) => postController.addCommentbyProf(req, res));
router.delete('/deletePost/:id', authenticate, (req, res) => postController.deletePost(req, res));

router.get('/notifications', authenticate, (req, res) => notificationController.getNotifications(req, res));
router.patch('/updateNotification/:id', authenticate, (req, res) => notificationController.updateNotification(req, res));

router.get('/requirements', authenticate, (req, res) => reqController.getRequirementsByService(req, res));
router.post('/webhook', (req, res) => controller.webhook(req, res));

export default router;