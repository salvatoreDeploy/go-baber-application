import "reflect-metadata";
import { Appointments } from "@prisma/client";
import { IAppointmentsRepository } from "../IAppointmentsRepository";
import { randomUUID } from "node:crypto";
import { getDate, getMonth, getYear, isEqual } from "date-fns";
import { IFindAllInMonthFromProvaiderDTO } from "../dtos/IFindAllInMonthFromProvaiderDTO";
import { IFindAllInDayFromProvaiderDTO } from "../dtos/IFindAllInDayFromProvaiderDTO";
import { IAppointmentsDayData } from "../prisma/AppointmentsRepository";

export class InMemoryAppointmentRepository implements IAppointmentsRepository {
  public appointments: Appointments[] = [];
  public appointmentsDayData: IAppointmentsDayData[] = [];

  async findByDate(date: Date, provider_id: string) {
    const appointment = this.appointments.find((appointment) =>
      isEqual(appointment.date, date) && appointment.provider_id === provider_id
    );

    if (!appointment) {
      return null;
    }

    return appointment;
  }
  async create(data: ICreateAppointmentsDTO): Promise<Appointments> {

    const appointment = {
      id: randomUUID(),
      provider_id: data.provider_id,
      user_id: data.user_id,
      date: data.date || new Date(),
      created_at: new Date(),
      updated_at: null || new Date(),
    };

    this.appointments.push(appointment)

    return appointment;
  }

  async createAppointmnetUser(data: ICreateAppointmentsDTO): Promise<IAppointmentsDayData> {


    const appointmentT = {
      id: randomUUID(),
      provider_id: data.provider_id,
      user_id: data.user_id,
      date: data.date || new Date(),
      created_at: new Date(),
      updated_at: null || new Date(),
      user: {
        id: randomUUID(),
        name: 'name',
        email: 'name@email.com.br',
        password: '123456',
        avatar: null,
        user_created_at: new Date(),
        user_updated_at: new Date()
      }
    };


    this.appointmentsDayData.push(appointmentT);

    return appointmentT;
  }
  
  async list(): Promise<Appointments[]> {
    return this.appointments;
  }

  async findAllInMonthFromProvaider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProvaiderDTO): Promise<Appointments[]> {
    const appointmentsMonth = this.appointments.filter(
      (appointment) =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    );

    return appointmentsMonth;
  }

  async findAllInDayFromProvaider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProvaiderDTO): Promise<IAppointmentsDayData[]> {

    const appointmentsDay = this.appointmentsDayData.filter(
      (appointment) =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    );

    return appointmentsDay;
  }
}
