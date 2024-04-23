import Notification from "../../domain/notification";

interface INotificationRepository {
    getNotifications(id: string): Promise<Notification | null>
    updateNotification(id: string): Promise<Boolean>
}

export default INotificationRepository;