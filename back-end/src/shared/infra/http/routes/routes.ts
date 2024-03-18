import { appointmentsRouter } from "@modules/appointments/infra/http/appointments.routes";
import { provaidersRouter } from "@modules/appointments/infra/http/provaiders.routes";
import { passwordRoutes } from "@modules/users/infra/http/password.routes";
import { profileRoutes } from "@modules/users/infra/http/profile.routes";
import { sessionsRoutes } from "@modules/users/infra/http/sessions.routes";
import { usersRoutes } from "@modules/users/infra/http/users.routes";
import { Router } from "express";


const routes = Router();

/* Appointments */
routes.use("/appointments", appointmentsRouter);

/* Provaiders */
routes.use('/provaiders', provaidersRouter)

/* Users */
routes.use("/users", usersRoutes);

/* Reset e Forgot Password */
routes.use("/password", passwordRoutes);

/* Autheticated */
routes.use("/", sessionsRoutes);

/* Profiles */
routes.use('/profile', profileRoutes)

export { routes };
