import { Notification } from "../../../../prisma/mongo/prisma";
import { ICreateNotificationDTO } from "./dtos/ICreateNotificationDTO";

export interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}