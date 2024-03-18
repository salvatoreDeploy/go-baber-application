import { Request, Response } from "express";
import { SendForgotPasswordEmailUseCase } from '@modules/users/useCase/SendForgotPasswordEmailUseCase/SendForgotPasswordEmailUseCase'
import { container } from "@shared/container";

class ForgotPasswordController {
  public async handle(request: Request, response: Response) {

    const { email } = request.body;

    const sendForgotPasswordEmailUseCase = container.resolve<SendForgotPasswordEmailUseCase>(SendForgotPasswordEmailUseCase)

    await sendForgotPasswordEmailUseCase.execute({
      email,
    });

    return response.status(204).json();
  }
}

export { ForgotPasswordController };