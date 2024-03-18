import { Request, Response } from "express";
import { ListProvaiderDayAvailabilitysUseCase } from "./ListDayAvailabityUseCase";
import { container } from "@shared/container";

class ListProvaiderDayAvailabilityController {
  async handle(request: Request, response: Response) {
    const { provider_id } = request.params;
    const { month, day, year } = request.query;

    const listProvaiderDayAvailabilitysUseCase =
      container.resolve<ListProvaiderDayAvailabilitysUseCase>(
        ListProvaiderDayAvailabilitysUseCase
      );

    const result = await listProvaiderDayAvailabilitysUseCase.execute({
      provider_id,
      month: Number(month),
      day: Number(day),
      year: Number(year),
    });

    return response.status(201).json(result);
  }
}

export { ListProvaiderDayAvailabilityController };
