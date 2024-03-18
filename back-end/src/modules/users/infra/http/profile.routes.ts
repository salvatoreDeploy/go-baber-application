import { UpdateProfileController } from "@modules/users/useCase/UpdateProfileUserUseCase/UpdateProfileController";
import { ensureAuthenticated } from "@modules/users/infra/http/middleware/ensureAuthenticated";
import { Router } from "express";
import { ShowProfileController } from "@modules/users/useCase/ShowProfileUseCase/ShowProfileController";
import { Joi, Segments, celebrate } from "celebrate";


const profileRoutes = Router();

const updateProfileController = new UpdateProfileController()
const showProfileController = new ShowProfileController()

profileRoutes.use(ensureAuthenticated)

profileRoutes.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string().when('old_password', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.string(),
    }),
    password_confirmation: Joi.string().when('old_password', {
      is: Joi.exist(),
      then: Joi.string().valid(Joi.ref('password')).required(),
      otherwise: Joi.string(),
    })
  }
}), updateProfileController.handle)

profileRoutes.get('/show', showProfileController.handle)


export { profileRoutes };