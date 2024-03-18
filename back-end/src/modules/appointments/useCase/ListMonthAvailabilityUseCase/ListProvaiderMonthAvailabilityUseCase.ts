import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IAppointmentsRepository } from "@modules/appointments/repositories/IAppointmentsRepository";
import { getDate, getDaysInMonth, isAfter } from "date-fns";

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProvaiderMonthAvailabilitysUseCase {
  constructor(
    @inject("AppointmentsRepository")
    private appointemntsRepository: IAppointmentsRepository
  ) { }

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointmentsMonth =
      await this.appointemntsRepository.findAllInMonthFromProvaider({
        provider_id,
        month,
        year,
      });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDaysArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );

    const availability = eachDaysArray.map((day) => {

      const compareDate = new Date(year, month - 1, day, 23, 59, 59)

      const appointmentsInDay = appointmentsMonth.filter((appointment) => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        available: isAfter(compareDate, new Date()) &&appointmentsInDay.length < 10,
      };
    });

    // console.log(vailability);

    return availability;
  }
}

export { ListProvaiderMonthAvailabilitysUseCase };
