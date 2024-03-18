import { IAppointmentsRepository } from "@modules/appointments/repositories/IAppointmentsRepository";
import { IAppointmentsDayData } from "@modules/appointments/repositories/prisma/AppointmentsRepository";
import { Appointments } from "@prisma/client";
import ICacheProvider from "@providers/CacheProvaider/models/ICacheProvider";
import { HttpAppointmentPresenter } from "@shared/infra/http/presenters/http-appointments-presenter";
import { inject, injectable } from "inversify";

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsUseCase {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("CacheProvaider")
    private cacheProvaider: ICacheProvider
  ) { }

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IAppointmentsDayData[]> {
    const key = `provider_appointments:${provider_id}:${year}-${month}-${day}`

    let appointments = await this.cacheProvaider.recover<IAppointmentsDayData[]>(key)

    if (!appointments) {
      appointments =
        await this.appointmentsRepository.findAllInDayFromProvaider({
          provider_id,
          day,
          month,
          year,
        });
      
      const promise = appointments.map(async (appointment) => { return HttpAppointmentPresenter.toHttp(appointment) })

      const result = await Promise.all(promise)
      
      await this.cacheProvaider.save({ key, value: result })
    }

    return appointments;
  }
}

export default ListProviderAppointmentsUseCase;
