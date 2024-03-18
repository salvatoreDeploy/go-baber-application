import { SessionsController } from "@modules/users/useCase/SessionsUsecase/SessionsController";
import { Joi, Segments, celebrate } from "celebrate";
import { Router } from "express";


const sessionsController = new SessionsController();

const sessionsRoutes = Router();

sessionsRoutes.post("/", celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }
}), sessionsController.handle);

export { sessionsRoutes };
