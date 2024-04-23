import { Request, Response } from 'express'
import NotificationUsecase from "../../use_case/notificationUsecase";

class NotificationController {
    private usecase: NotificationUsecase;

    constructor(usecase: NotificationUsecase) {
        this.usecase = usecase;
    }

    async getNotifications(req: Request, res: Response) {
        try {
            const id = req.profId;
            const notifications = await this.usecase.getNotifications(id as string);
            res.status(200).json({ success: true, notifications });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async updateNotification(req: Request, res: Response) {
        try {
            let id = req.params.id;
            const updated = await this.usecase.updateNotification(id);
            if (updated) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
}

export default NotificationController;