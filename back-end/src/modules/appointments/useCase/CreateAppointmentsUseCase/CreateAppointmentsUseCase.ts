import "reflect-metadata";
import { IAppointmentsRepository } from "@modules/appointments/repositories/IAppointmentsRepository";
import { AppError } from "@shared/error/AppError";
import { daysToWeeks, format, getHours, isBefore, startOfHour } from "date-fns";
import { inject, injectable } from "inversify";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import ICacheProvider from "@providers/CacheProvaider/models/ICacheProvider";
import { ptBR } from "date-fns/locale";

@injectable()
class CreateAppointmentsUseCase {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,

    @inject("CacheProvaider")
    private cacheProvaider: ICacheProvider
  ) { }

  async execute({ provider_id, user_id, date }: ICreateAppointmentsDTO) {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on past date.");
    }

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentDate, provider_id);

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can't create an appointment between 8am and 5pm."
      );
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with youself.");
    }

    if (findAppointmentInSameDate) {
      throw new AppError("This appointment is already booked");
    }

  
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });


    const dateFormated = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'hrs", {locale: ptBR})

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo gendamento para o dia, ${dateFormated}`
    })

    const key = `provider_appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`

    await this.cacheProvaider.invalidate(key)

    return appointment;
  }
}

export default CreateAppointmentsUseCase;