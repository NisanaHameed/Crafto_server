import express from 'express'
import ChatController from '../../adaptors/controllers/chatController';
import ChatUsecase from '../../use_case/chatUsecase';
import ConversationRepository from '../repository/conversationRepository';
import MessageRepository from '../repository/messageRepository';
import profAuth from '../middleware/profAuth';
import userAuth from '../middleware/userAuth';


const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();

const usecase = new ChatUsecase(conversationRepository, messageRepository);
const controller = new ChatController(usecase);

const router = express.Router();

router.post('/newConversation/:id', userAuth, (req, res) => controller.newConversation(req, res));
router.get('/conversations', profAuth, (req, res) => controller.getConversations(req, res));
router.post('/newMessage', (req, res) => controller.newMessage(req, res));
router.get('/messages/:id', (req, res) => controller.getMessages(req, res));
router.get('/getUserById/:id', (req, res) => controller.getUserById(req, res));

export default router
