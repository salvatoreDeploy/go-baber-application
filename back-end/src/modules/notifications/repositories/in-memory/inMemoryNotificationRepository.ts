import { ObjectId } from "mongodb";
import { Notification } from "../../../../../prisma/mongo/prisma";
import { INotificationsRepository } from "../INotificationsRepository";
import { ICreateNotificationDTO } from "../dtos/ICreateNotificationDTO";


export class inMemoryNotificationRepository implements INotificationsRepository {

  public notifications: Notification[] = []

  async create(data: ICreateNotificationDTO): Promise<Notification> {
    const notification = {
      id: new ObjectId().toHexString(),
      content: data.content,
      recipient_id: data.recipient_id,
      read: null,
      created_at: new Date(),
      updated_at: new Date()
    }

    this.notifications.push(notification)

    return notification

  }

}