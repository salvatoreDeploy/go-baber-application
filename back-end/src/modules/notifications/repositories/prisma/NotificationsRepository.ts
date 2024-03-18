import { injectable } from "inversify";
import { INotificationsRepository } from "../INotificationsRepository";
import { ICreateNotificationDTO } from "../dtos/ICreateNotificationDTO";
import { Notification } from "../../../../../prisma/mongo/prisma";
import prismaClientMongo from "@shared/infra/mongo";
import { PrismaClient } from "../../../../../prisma/mongo/prisma/index"

@injectable()
class NotificationsRepository implements INotificationsRepository {
  private ormPrisma: PrismaClient;

  constructor() {
    this.ormPrisma = prismaClientMongo;
  }

  public async create({
    content,
    recipient_id
  }: ICreateNotificationDTO): Promise<Notification> {
    const notifications = await this.ormPrisma.notification.create({
      data: {
        content,
        recipient_id
      },
    });
    return notifications;
  }
}
export default NotificationsRepository;
