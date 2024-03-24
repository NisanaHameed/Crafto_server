import express from 'express'
import AdminRepository from '../repository/adminRepository'
import AdminUsecase from '../../use_case/adminUsecase'
import AdminController from '../../adaptors/controllers/adminController'
import JWT from '../utils/jwt'
import HashPassword from '../utils/hashPassword'
import authenticate from '../middleware/adminAuth'

const jwt = new JWT();
const hash = new HashPassword();
const repository = new AdminRepository();

const useCase = new AdminUsecase(repository,jwt,hash);
const controller = new AdminController(useCase);

const router = express.Router();

router.post('/login',(req,res)=>controller.login(req,res));
router.get('/users',authenticate,(req,res)=>controller.getUsers(req,res));
router.post('/blockUser/:id',authenticate,(req,res)=>controller.blockUser(req,res));
router.get('/professionals',authenticate,(req,res)=>controller.getProfessionals(req,res));
router.post('/blockProfessional/:id',authenticate,(req,res)=>controller.blockProfessional(req,res));
router.get('/logout',(req,res)=>controller.logout(req,res));

export default router;