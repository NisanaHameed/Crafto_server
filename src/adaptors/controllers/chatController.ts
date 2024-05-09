import ChatUsecase from "../../use_case/chatUsecase";
import { Request, Response } from 'express';

class ChatController {

    private usecase: ChatUsecase;

    constructor(usecase: ChatUsecase) {
        this.usecase = usecase;
    }

    async newConversation(req: Request, res: Response) {
        try {

            let senderId = req.userId;
            // let senderId = '66054acff4efb06f3be368e8'
            const receiverId = req.params.id;
            if (senderId) {
                const newConversation = await this.usecase.saveConversation(senderId, receiverId);
                res.status(200).json({ success: true, newConversation });
            } else {
                res.status(401).json({ success: false, message: 'User is not authenticated!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async getConversations(req: Request, res: Response) {
        try {
            let id = req.profId;
            if (id) {
                const conversations = await this.usecase.getConversations(id);
                res.status(200).json({ success: true, conversations });
            } else {
                res.status(401).json({ success: false, message: 'Internal server error!' });
            }

        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            let id = req.params.id;
            const user = await this.usecase.getUserById(id);
            res.status(200).json({ success: true, user });
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }

    async newMessage(req: Request, res: Response) {
        try {
            const data = req.body;
            const message = await this.usecase.newMessage(data);
            if (message) {
                res.status(200).json({ success: true ,message});
            } else {
                res.status(500).json({ success: false, message: 'Message is not saved.try again' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' })
        }
    }

    async getMessages(req: Request, res: Response) {
        try {
            const conversationId = req.params.id;
            const messages = await this.usecase.getMessages(conversationId);
            res.status(200).json({ success: true, messages });
            
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

export default ChatController;