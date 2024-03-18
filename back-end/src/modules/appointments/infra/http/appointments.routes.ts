import { CreateAppointmentsController } from "@modules/appointments/useCase/CreateAppointmentsUseCase/CreateAppointmentsController";
import { ListAppointmentsController } from "@modules/appointments/useCase/ListAppointmentsUseCase/ListAppointmentsController";
import ListProvaiderAppointmentsController from "@modules/appointments/useCase/ListProvaiderAppointmentsUseCase/ListProvaiderAppointmentsController";
import { ensureAuthenticated } from "@modules/users/infra/http/middleware/ensureAuthenticated";
import { celebrate, Joi, Segments } from "celebrate"
import { Router } from "express";


const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

const createAppointmentsController = new CreateAppointmentsController();
const listAppointmentsController = new ListAppointmentsController();
const listProvaiderAppointmentsController = new ListProvaiderAppointmentsController()

appointmentsRouter.post(
  "/createappointments", celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required()
    }
  }),
  createAppointmentsController.handle
);
appointmentsRouter.get("/listappointments", listAppointmentsController.handle);

appointmentsRouter.get("/me", listProvaiderAppointmentsController.handle);

export { appointmentsRouter };
