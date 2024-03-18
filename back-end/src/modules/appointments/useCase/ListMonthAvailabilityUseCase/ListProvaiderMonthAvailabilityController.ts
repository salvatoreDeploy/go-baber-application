import { Request, Response } from "express";
import { ListProvaiderMonthAvailabilitysUseCase } from "./ListProvaiderMonthAvailabilityUseCase";
import { container } from "@shared/container";

class ListProvaiderMonthAvailabilityController {
  async handle(request: Request, response: Response) {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    const listProvaiderMonthAvailabilitysUseCase =
      container.resolve<ListProvaiderMonthAvailabilitysUseCase>(
        ListProvaiderMonthAvailabilitysUseCase
      );

    const result = await listProvaiderMonthAvailabilitysUseCase.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.status(201).json(result);
  }
}

export { ListProvaiderMonthAvailabilityController };
