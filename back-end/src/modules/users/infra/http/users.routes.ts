import Upload from "@config/Upload";
import { CreateUsersController } from "@modules/users/useCase/CreateUsersUseCase/CreateUsersController";
import { ListUsersController } from "@modules/users/useCase/ListUsersUseCase/ListUsersController";
import { UpdateAvatarUserController } from "@modules/users/useCase/UpdateAvatarUserUseCase/UpdateAvatarUserController";
import { ensureAuthenticated } from "@modules/users/infra/http/middleware/ensureAuthenticated";
import { Router } from "express";
import multer from "multer";
import { Joi, Segments, celebrate } from "celebrate";

const createUsersController = new CreateUsersController();
const updateAvatarUserController = new UpdateAvatarUserController();
const listUsersController = new ListUsersController();

const usersRoutes = Router();

const upload = multer(Upload.multer);

usersRoutes.post("/createuser",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }
  })
  , createUsersController.handle);
usersRoutes.patch(
  "/uploadavatar",
  ensureAuthenticated,
  upload.single("avatar"),
  updateAvatarUserController.handle
);
usersRoutes.get("/listusers", listUsersController.handle);


export { usersRoutes };
