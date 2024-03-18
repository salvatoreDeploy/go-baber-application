import { Appointments, PrismaClient } from "@prisma/client";
import prismaClient from "@shared/infra/prisma";
import { IAppointmentsRepository } from "../IAppointmentsRepository";
import { injectable } from "inversify";
import { IFindAllInMonthFromProvaiderDTO } from "../dtos/IFindAllInMonthFromProvaiderDTO";
import { IFindAllInDayFromProvaiderDTO } from "../dtos/IFindAllInDayFromProvaiderDTO";

export interface IAppointmentsDayData extends Appointments{
  user: {
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    user_created_at: Date;
    user_updated_at: Date;
  };
}

@injectable()
class AppointmentsRepository implements IAppointmentsRepository {
  private ormPrisma: PrismaClient;

  constructor() {
    this.ormPrisma = prismaClient;
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointments | null> {
    const findAppointment = await this.ormPrisma.appointments.findFirst({
      where: {
        date,
        provider_id
      },
    });

    return findAppointment || null;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointments> {
    const appointment = await this.ormPrisma.appointments.create({
      data: {
        provider_id,
        user_id,
        date,
      },
    });
    return appointment;
  }

  public async list(): Promise<Appointments[]> {
    const appointments = await this.ormPrisma.appointments.findMany();

    return appointments;
  }

  public async findAllInMonthFromProvaider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProvaiderDTO): Promise<Appointments[]> {
    const parsedMonth = String(month).padStart(2, "0");

    const appointmentMonth: Appointments[] = await this.ormPrisma.$queryRaw`
      SELECT *
      FROM appointments
      WHERE to_char(date, 'MM-YYYY') = '${parsedMonth}-${year}'
      AND provider_id = ${provider_id};
    `;

    return appointmentMonth;
  }

  public async findAllInDayFromProvaider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProvaiderDTO): Promise<IAppointmentsDayData[]> {
    const parsedDay = String(day).padStart(2, "0");
    const parsedMonth = String(month).padStart(2, "0");

    const appointmentDay: any[] = await this.ormPrisma
      .$queryRawUnsafe(`
      SELECT appointments.*, users.*, users.created_at AS user_created_at, users.updated_at AS user_updated_at
      FROM appointments
      JOIN users ON appointments.user_id = users.id
      WHERE TO_CHAR(date::timestamp at time zone 'UTC', 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'
      AND appointments.provider_id = '${provider_id}'
    `)

    const data: IAppointmentsDayData[] = appointmentDay.map(appointment => ({
      id: appointment.id,
      date: appointment.date,
      provider_id: appointment.provider_id,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at,
      user_id: appointment.user_id,
      user: {
        name: appointment.name,
        email: appointment.email,
        password: appointment.password,
        avatar: appointment.avatar,
        user_created_at: appointment.user_created_at,
        user_updated_at: appointment.user_updated_at
      }
    }));

    return data;
  }
}

export default AppointmentsRepository;
