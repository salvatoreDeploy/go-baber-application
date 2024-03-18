import { ListProvaiderDayAvailabilityController } from "@modules/appointments/useCase/ListDayAvailabityUseCase/ListDayAvailabityController";
import { ListProvaiderMonthAvailabilityController } from "@modules/appointments/useCase/ListMonthAvailabilityUseCase/ListProvaiderMonthAvailabilityController";
import { ListProvaidersController } from "@modules/appointments/useCase/ListProvaidersUseCase/ListProvaidersController";
import { ensureAuthenticated } from "@modules/users/infra/http/middleware/ensureAuthenticated";
import { Joi, Segments, celebrate } from "celebrate";
import { Router } from "express";


const provaidersRouter = Router();

const listProvaidersController = new ListProvaidersController()
const listProvaiderMonthAvailabilityController = new ListProvaiderMonthAvailabilityController()
const listProvaiderDayAvailabilityController = new ListProvaiderDayAvailabilityController()

provaidersRouter.use(ensureAuthenticated);

provaidersRouter.get('/', listProvaidersController.handle)
provaidersRouter.get('/:provider_id/month-availability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required()
  }
}), listProvaiderMonthAvailabilityController.handle)
provaidersRouter.get('/:provider_id/day-availability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required()
  }
}), listProvaiderDayAvailabilityController.handle)


export { provaidersRouter };