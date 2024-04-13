import express from "express";
import UserController from "../../adaptors/controllers/userController"
import Userusecase from "../../use_case/userUsecase";
import UserRepository from "../repository/userRepository";
import GenerateOTP from "../utils/otpGenerator";
import SendMail from "../utils/sendMail";
import HashPassword from "../utils/hashPassword";
import JWT from "../utils/jwt";
import authenticate from "../middleware/userAuth";
import { uploadFile } from '../middleware/multer'
import Cloudinary from "../utils/cloudinary";
import PostController from "../../adaptors/controllers/postController";
import PostRepository from "../repository/postRepository";
import PostUsecase from "../../use_case/postUsecase";
import RequirementController from "../../adaptors/controllers/requirementController";
import RequirementUsecase from "../../use_case/requirementUsecase";
import RequirementRepository from "../repository/requirementRepository";
import ConversationRepository from "../repository/conversationRepository";

const repository = new UserRepository();
const otp = new GenerateOTP();
const sendOtp = new SendMail();
const hash = new HashPassword();
const jwt = new JWT();
const cloudinary = new Cloudinary();
const conversation = new ConversationRepository()

const useCase = new Userusecase(repository, otp, sendOtp, hash, jwt, cloudinary, conversation)
const controller = new UserController(useCase);

const postRepository = new PostRepository();
const postUsecase = new PostUsecase(cloudinary, postRepository);
const postController = new PostController(postUsecase);

const reqRepository = new RequirementRepository();
const reqUsecase = new RequirementUsecase(reqRepository);
const reqController = new RequirementController(reqUsecase);

const router = express.Router();

router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/verifyotp', (req, res) => controller.verifyOTP(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/gsignup', (req, res) => controller.gsignup(req, res));
router.get('/profile', authenticate, (req, res) => controller.getProfile(req, res));
router.patch('/editProfile', authenticate, uploadFile.single('image'), (req, res) => controller.editProfile(req, res));
router.post('/follow', authenticate, (req, res) => controller.followProfessional(req, res));
router.post('/unfollow', authenticate, (req, res) => controller.unfollowProfessional(req, res));
router.get('/logout', (req, res) => controller.logout(req, res));

router.get('/designs/:category', (req, res) => postController.getDesigns(req, res));
router.get('/allDesigns', (req, res) => postController.getAllPosts(req, res));
router.get('/postsById/:id', (req, res) => postController.getPostsById(req, res));
router.put('/like/:id', authenticate, (req, res) => postController.likeByUSer(req, res));
router.put('/unlike/:id', authenticate, (req, res) => postController.unlikeByUser(req, res));
router.get('/postDetails/:id', (req, res) => postController.getAPostById(req, res));
router.put('/postComment', authenticate, (req, res) => postController.addCommentbyUser(req, res));

router.post('/postRequirement', authenticate, (req, res) => reqController.saveRequirement(req, res));
router.get('/requirements', authenticate, (req, res) => reqController.getRequirements(req, res));
router.put('/updateReq', authenticate, (req, res) => reqController.updateRequirement(req, res));

router.get('/conversations', authenticate, (req, res) => controller.getConversations(req, res));

export default router;