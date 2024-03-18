import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IAppointmentsRepository } from "@modules/appointments/repositories/IAppointmentsRepository";
import { getHours, isAfter } from "date-fns";

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProvaiderDayAvailabilitysUseCase {
  constructor(
    @inject("AppointmentsRepository")
    private appointemntsRepository: IAppointmentsRepository
  ) { }

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments =
      await this.appointemntsRepository.findAllInDayFromProvaider({
        provider_id,
        day,
        month,
        year,
      });

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour);

      /* 
          isAfter(compareDate, currentDate)
          - Vai comprarar a data selcionada com data atual para não
          ser possivel de realizar agendamento em uma data ou horario no passado.
      */

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export { ListProvaiderDayAvailabilitysUseCase };