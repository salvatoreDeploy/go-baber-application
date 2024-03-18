import { Request, Response } from "express";
import { ResetPasswordEmailUseCase } from "./ResetPasswordUseCase";
import { container } from "@shared/container";

class ResetPasswordController {
  public async handle(request: Request, response: Response) {

    const { token, password, old_password} = request.body;

    const resetPasswordUseCase = container.resolve<ResetPasswordEmailUseCase>(ResetPasswordEmailUseCase)

    await resetPasswordUseCase.execute({
      token,
      password,
      old_password,
    });

    return response.status(204).json();
  }
}

export { ResetPasswordController };