import { Request, Response } from "express";
import { container } from "@shared/container";
import { ListProvaidersUseCase } from "./ListProvaidersUseCase";
import { HttpUserPresenter } from "@shared/infra/http/presenters/http-user-presenter";

class ListProvaidersController {
  async handle(request: Request, response: Response) {

    const user_id = request.user.id

    const listProvaidersUsecase = container.resolve<ListProvaidersUseCase>(ListProvaidersUseCase)

    const result = await listProvaidersUsecase.execute({
      user_id
    });

    const userPresenter = await HttpUserPresenter.toHttpArray(result)

    return response.status(201).json(userPresenter);
  }
}

export { ListProvaidersController };