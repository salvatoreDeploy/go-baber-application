import Upload from "@config/Upload";
import { IAppointmentsDayData } from "@modules/appointments/repositories/prisma/AppointmentsRepository";
import { Appointments, Users } from "@prisma/client";
import { getUrlImage } from "utils/getUrl";

export class HttpAppointmentPresenter {
  static async toHttp(appointment: IAppointmentsDayData) {
    return {
      id: appointment.id,
      date: appointment.date,
      provider_id: appointment.provider_id,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at,
      user_id: appointment.user_id,
      user: {
        name: appointment.user.name,
        email: appointment.user.email,
        avatar: appointment.user.avatar,
        avatar_url: await this.formatUrl(appointment, appointment.user.avatar),
        user_created_at: appointment.user.user_created_at,
        user_updated_at: appointment.user.user_updated_at
      }
    };
  }

  private static async formatUrl(
    appointment: IAppointmentsDayData,
    url: string | null
  ): Promise<string | null> {
    // Verifica se a URL é nula ou vazia
    if (!url) {
      return null;
    }

    if (!appointment.user.avatar) {
      return null
    }

    switch (Upload.driver) {
      case "disk":
        return `${process.env.APP_API_URL_DEVELOPMENT}/files/${url}`;
      case "cloudFlare":
        const imageUrl = await getUrlImage(appointment.user.avatar);

        return imageUrl;
    }

    // Adiciona um domínio base à URL ou faz qualquer manipulação necessária
  }
}