import { Request, Response } from "express";
import { parseISO, parseJSON, toDate } from "date-fns";
import CreateAppointmentsUseCase from "./CreateAppointmentsUseCase";
import { container } from "@shared/container";

class CreateAppointmentsController {
  async handle(request: Request, response: Response) {
    const user_id = request.user.id;

    const { provider_id, date } = request.body;

    const createAppointmentsUsecase =
      container.resolve<CreateAppointmentsUseCase>(CreateAppointmentsUseCase);

    const result = await createAppointmentsUsecase.execute({
      provider_id,
      user_id,
      date
    });

    return response.status(201).json(result);
  }
}

export { CreateAppointmentsController };
