import notificationModel from "../database/notificationModel";
import Notification from "../../domain/notification";
import INotificationRepository from "../../use_case/interface/INotificationRepository";

class NotificationRepository implements INotificationRepository {

    async getNotifications(id: string): Promise<Notification | null> {
        try {
            const notifications: any = await notificationModel.find({ userId: id });
            return notifications;
        } catch (err) {
            throw new Error('Failed to fetch notifications!');
        }
    }

    async updateNotification(id: string): Promise<Boolean> {
        try {
            const updated = await notificationModel.updateOne({ _id: id }, { $set: { readStatus: true } });
            console.log(updated)
            return updated.acknowledged;
        } catch (err) {
            throw new Error("Failed to update notification");
        }
    }
}

export default NotificationRepository;