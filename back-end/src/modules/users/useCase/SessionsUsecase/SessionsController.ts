import { Request, Response } from "express";
import { AuthenticatesessionsUseCase } from "./AuthenticateSessionsUseCase";
import { container } from "@shared/container";
import { HttpUserPresenter } from "@shared/infra/http/presenters/http-user-presenter";

class SessionsController {
  public async handle(request: Request, response: Response) {

    const { email, password } = request.body;

    const authenticateSessionsUseCase = container.resolve<AuthenticatesessionsUseCase>(AuthenticatesessionsUseCase)

    const { user, token } = await authenticateSessionsUseCase.execute({
      email,
      password,
    });

    const userPresenter = await HttpUserPresenter.toHttp(user)

    return response.json({ userPresenter, token });
  }
}

export { SessionsController };
