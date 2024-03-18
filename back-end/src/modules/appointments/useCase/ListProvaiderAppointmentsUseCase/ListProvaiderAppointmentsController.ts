import { container } from "@shared/container";
import { Request, Response } from "express";
import ListProviderAppointmentsUseCase from "./ListProvaiderAppointmentsUseCase";
import { HttpAppointmentPresenter } from "@shared/infra/http/presenters/http-appointments-presenter";

class ListProvaiderAppointmentsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { day, month, year } = request.query;

    const listProvaiderAppointmentsController =
      container.resolve<ListProviderAppointmentsUseCase>(
        ListProviderAppointmentsUseCase
      );

    const appointments = await listProvaiderAppointmentsController.execute({
      provider_id: id,
      month: Number(month),
      day: Number(day),
      year: Number(year),
    });

    const promise = appointments.map(async (appointment) => { return HttpAppointmentPresenter.toHttp(appointment) })
    
    const result = await Promise.all(promise)

    return response.status(200).json((result));
  }
}

export default ListProvaiderAppointmentsController;