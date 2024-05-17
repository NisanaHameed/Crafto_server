import express from 'express'
import AdminRepository from '../repository/adminRepository'
import AdminUsecase from '../../use_case/adminUsecase'
import AdminController from '../../adaptors/controllers/adminController'
import JWT from '../utils/jwt'
import HashPassword from '../utils/hashPassword'
import authenticate from '../middleware/adminAuth'
import Cloudinary from '../utils/cloudinary'
import { uploadFile } from '../middleware/multer'
import StripePayment from '../utils/stripe'

const jwt = new JWT();
const hash = new HashPassword();
const cloudinary = new Cloudinary();
const stripe = new StripePayment();
const repository = new AdminRepository();

const useCase = new AdminUsecase(repository, jwt, hash, cloudinary, stripe);
const controller = new AdminController(useCase);

const router = express.Router();

router.post('/login', (req, res) => controller.login(req, res));
router.get('/dashboard', authenticate, (req, res) => controller.getDashboard(req, res));
router.get('/users', authenticate, (req, res) => controller.getUsers(req, res));
router.post('/blockUser/:id', authenticate, (req, res) => controller.blockUser(req, res));
router.get('/professionals', (req, res) => controller.getProfessionals(req, res));
router.post('/blockProfessional/:id', authenticate, (req, res) => controller.blockProfessional(req, res));
router.get('/category', (req, res) => controller.getCategory(req, res));
router.post('/addCategory', uploadFile.single('image'), (req, res) => controller.addCategory(req, res));
router.put('/editCategory', uploadFile.single('image'), (req, res) => controller.editCategory(req, res));
router.get('/jobrole', (req, res) => controller.getJobrole(req, res));
router.post('/addJobrole', (req, res) => controller.addJobrole(req, res));
router.delete('/deleteJobrole/:id', authenticate, (req, res) => controller.deleteJobrole(req, res));
router.put('/editJobrole', authenticate, (req, res) => controller.editJobrole(req, res));
router.get('/subscriptions', authenticate, (req, res) => controller.getSubscriptions(req, res));
router.get('/subscriptionDetails/:id', (req, res) => controller.getASubscription(req, res));
router.get('/logout', (req, res) => controller.logout(req, res));

export default router;