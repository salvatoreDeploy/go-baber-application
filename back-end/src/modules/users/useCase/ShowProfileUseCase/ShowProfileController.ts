import { Request, Response } from "express";
import { container } from "@shared/container";
import { ShowProfileUseCase } from "./ShowProfileUseCase";
import { HttpUserPresenter } from "@shared/infra/http/presenters/http-user-presenter";


class ShowProfileController {
  public async handle(request: Request, response: Response) {
    const user_id = request.user.id

    const showProfileUseCase =
      container.resolve<ShowProfileUseCase>(ShowProfileUseCase);

    const result = await showProfileUseCase.execute({
      user_id,
    });

    const userPresenter = await HttpUserPresenter.toHttp(result)


    return response.status(200).json(userPresenter);
  }
}

export { ShowProfileController };