import INotificationRepository from "./interface/INotificationRepository";

class NotificationUsecase {
    private repository: INotificationRepository;

    constructor(repository: INotificationRepository) {
        this.repository = repository;
    }

    async getNotifications(id: string) {
        try {
            const notifications = await this.repository.getNotifications(id);
            return notifications;
        } catch (err) {
            throw err;
        }
    }

    async updateNotification(id: string) {
        try {
            const updated = await this.repository.updateNotification(id);
            return updated;
        } catch (err) {
            return err;
        }
    }
}

export default NotificationUsecase;