import 'reflect-metadata';
import { IAppointmentsRepository } from "@modules/appointments/repositories/IAppointmentsRepository";
import { Appointments } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
class ListAppointmentsUseCase {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository) { }

  public async execute(): Promise<Appointments[]> {

    const appointements = await this.appointmentsRepository.list();

    return appointements;
  }
}

export { ListAppointmentsUseCase };
