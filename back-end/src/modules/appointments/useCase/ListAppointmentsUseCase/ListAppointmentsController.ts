import { Request, Response } from "express";
import { ListAppointmentsUseCase } from "./ListAppointmentsUseCase";
import { container } from "@shared/container";

class ListAppointmentsController {
  public async handle(request: Request, response: Response): Promise<Response> {

    const listAppointmentsUseCase = container.resolve<ListAppointmentsUseCase>(ListAppointmentsUseCase)

    const allAppointments = await listAppointmentsUseCase.execute();

    return response.json(allAppointments);
  }
}

export { ListAppointmentsController };
