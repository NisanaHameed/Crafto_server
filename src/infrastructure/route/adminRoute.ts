import express from 'express'
import AdminRepository from '../repository/adminRepository'
import AdminUsecase from '../../use_case/adminUsecase'
import AdminController from '../../adaptors/controllers/adminController'
import JWT from '../utils/jwt'
import HashPassword from '../utils/hashPassword'
import authenticate from '../middleware/adminAuth'
import Cloudinary from '../utils/cloudinary'
import {uploadFile} from '../middleware/multer'

const jwt = new JWT();
const hash = new HashPassword();
const cloudinary = new Cloudinary();
const repository = new AdminRepository();

const useCase = new AdminUsecase(repository,jwt,hash,cloudinary);
const controller = new AdminController(useCase);

const router = express.Router();

router.post('/login',(req,res)=>controller.login(req,res));
router.get('/users',authenticate,(req,res)=>controller.getUsers(req,res));
router.post('/blockUser/:id',authenticate,(req,res)=>controller.blockUser(req,res));
router.get('/professionals',authenticate,(req,res)=>controller.getProfessionals(req,res));
router.post('/blockProfessional/:id',authenticate,(req,res)=>controller.blockProfessional(req,res));
router.get('/category',authenticate,(req,res)=>controller.getCategory(req,res));
router.post('/addCategory',authenticate,uploadFile.single('image'),(req,res)=>controller.addCategory(req,res));
router.get('/jobrole',authenticate,(req,res)=>controller.getJobrole(req,res));
router.post('/addJobrole',authenticate,(req,res)=>controller.addJobrole(req,res));
router.delete('/deleteJobrole/:id',authenticate,(req,res)=>controller.deleteJobrole(req,res));
router.put('/editJobrole',authenticate,(req,res)=>controller.editJobrole(req,res));
router.get('/logout',(req,res)=>controller.logout(req,res));

export default router;