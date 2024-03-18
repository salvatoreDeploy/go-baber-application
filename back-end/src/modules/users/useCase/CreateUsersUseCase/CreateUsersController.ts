import { Request, Response } from "express";
import { CreateUsersUseCase } from "./CreateUsersUseCase";
import { container } from "@shared/container";
import { HttpUserPresenter } from "@shared/infra/http/presenters/http-user-presenter";

class CreateUsersController {
  public async handle(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const createUsersUseCase =
      container.resolve<CreateUsersUseCase>(CreateUsersUseCase);

    const result = await createUsersUseCase.execute({
      name,
      email,
      password,
    });

    const userPresenter = await HttpUserPresenter.toHttp(result)

    return response.status(201).json(userPresenter);
  }
}

export { CreateUsersController };
