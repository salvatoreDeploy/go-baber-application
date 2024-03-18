import { Appointments } from "@prisma/client";
import { IFindAllInMonthFromProvaiderDTO } from "./dtos/IFindAllInMonthFromProvaiderDTO";
import { IFindAllInDayFromProvaiderDTO } from "./dtos/IFindAllInDayFromProvaiderDTO";
import { IAppointmentsDayData } from "./prisma/AppointmentsRepository";

export interface IAppointmentsRepository {
  findByDate(date: Date, provider_id: string): Promise<Appointments | null>;
  create(data: ICreateAppointmentsDTO): Promise<Appointments>;
  list(): Promise<Appointments[]>;
  findAllInMonthFromProvaider(
    data: IFindAllInMonthFromProvaiderDTO
  ): Promise<Appointments[]>;
  findAllInDayFromProvaider(
    data: IFindAllInDayFromProvaiderDTO
  ): Promise<IAppointmentsDayData[]>;
}
