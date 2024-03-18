import { ResetPasswordController } from "@modules/users/useCase/ResetPasswordUseCase/ResetPasswordController";
import { ForgotPasswordController } from "@modules/users/useCase/SendForgotPasswordEmailUseCase/SendForgotPasswordEmailController";
import { Joi, Segments, celebrate } from "celebrate";
import { Router } from "express";

const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

const passwordRoutes = Router();

passwordRoutes.post("/forgot", celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required()
  }
}), forgotPasswordController.handle);

passwordRoutes.post("/reset", celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    old_password: Joi.string().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password'))
  }
}), resetPasswordController.handle);

export { passwordRoutes };