import { Container } from "inversify";
import "@providers/EmailProvider";
import "@providers/MailTemplateProvider";
import "@providers/StorageProvaider";
import AppointmentsRepository from "@modules/appointments/repositories/prisma/AppointmentsRepository";
import { IAppointmentsRepository } from "@modules/appointments/repositories/IAppointmentsRepository";
import CreateAppointmentsUseCase from "@modules/appointments/useCase/CreateAppointmentsUseCase/CreateAppointmentsUseCase";
import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { UsersRepository } from "@modules/users/reporitories/prisma/UsersRepository";
import { CreateUsersUseCase } from "@modules/users/useCase/CreateUsersUseCase/CreateUsersUseCase";
import { ListAppointmentsUseCase } from "@modules/appointments/useCase/ListAppointmentsUseCase/ListAppointmentsUseCase";
import { ListUsersUseCase } from "@modules/users/useCase/ListUsersUseCase/ListUsersUseCase";
import { AuthenticatesessionsUseCase } from "@modules/users/useCase/SessionsUsecase/AuthenticateSessionsUseCase";
import { UpdateAvatarUserUseCase } from "@modules/users/useCase/UpdateAvatarUserUseCase/UpdateAvatarUserUseCase";
import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";
import { BCryptProvider } from "@modules/users/providers/HashProvider/implementations/BCryptProvider";
import { IUserTokenRepository } from "@modules/users/reporitories/IUserTokenRepository";
import { UserTokenRepository } from "@modules/users/reporitories/prisma/UserTokenRepository";
import { ResetPasswordEmailUseCase } from "@modules/users/useCase/ResetPasswordUseCase/ResetPasswordUseCase";
import { SendForgotPasswordEmailUseCase } from "@modules/users/useCase/SendForgotPasswordEmailUseCase/SendForgotPasswordEmailUseCase";
import { ListProvaidersUseCase } from "@modules/appointments/useCase/ListProvaidersUseCase/ListProvaidersUseCase";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import NotificationsRepository from "@modules/notifications/repositories/prisma/NotificationsRepository";
import { IStorageProvaider } from "@providers/StorageProvaider/models/IStorageProvaider";
import { LocalStorageProvaider } from "@providers/StorageProvaider/implementations/LocalStorageProvaider";
import { CloudFlareStorageProvaider } from "@providers/StorageProvaider/implementations/CloudFlareStorageProvaider";
import IMailTemplateProvaider from "@providers/MailTemplateProvider/models/IMailTemplateProvaider";
import { HandlebarsMailTemplateProvider } from "@providers/MailTemplateProvider/implementations/HandlebarsMailTemplate";
import { provaiderEmailTemplate } from "@providers/MailTemplateProvider";
import { IMailProvider } from "@providers/EmailProvider/models/IMailProvider";
import { selectedProviderEmail } from "@providers/EmailProvider";
import { selectedProviderStorage } from "@providers/StorageProvaider";
import ICacheProvaider from "@providers/CacheProvaider/models/ICacheProvider";
import { provaiderCache } from "@providers/CacheProvaider";
import { ListProvaiderDayAvailabilitysUseCase } from "@modules/appointments/useCase/ListDayAvailabityUseCase/ListDayAvailabityUseCase";
import { ListProvaiderMonthAvailabilitysUseCase } from "@modules/appointments/useCase/ListMonthAvailabilityUseCase/ListProvaiderMonthAvailabilityUseCase";
import ListProviderAppointmentsUseCase from "@modules/appointments/useCase/ListProvaiderAppointmentsUseCase/ListProvaiderAppointmentsUseCase";
import { EtherealMailProvider } from "@providers/EmailProvider/implementations/EtheralMailProvider";

const container = new Container();

/* Dependecy Injection Investify */

/* Providers */

/*  Hash Password */

container.bind<IHashProvider>("HashProvider").to(BCryptProvider);

/* Appointemnsts */

container
  .bind<IAppointmentsRepository>("AppointmentsRepository")
  .to(AppointmentsRepository);
container
  .bind<CreateAppointmentsUseCase>(CreateAppointmentsUseCase)
  .to(CreateAppointmentsUseCase);
container
  .bind<ListProvaiderDayAvailabilitysUseCase>(
    ListProvaiderDayAvailabilitysUseCase
  )
  .to(ListProvaiderDayAvailabilitysUseCase);
container
  .bind<ListProvaiderMonthAvailabilitysUseCase>(
    ListProvaiderMonthAvailabilitysUseCase
  )
  .to(ListProvaiderMonthAvailabilitysUseCase);
container
  .bind<ListProviderAppointmentsUseCase>(ListProviderAppointmentsUseCase)
  .to(ListProviderAppointmentsUseCase);
container
  .bind<ListAppointmentsUseCase>(ListAppointmentsUseCase)
  .to(ListAppointmentsUseCase);
container
  .bind<ListProvaidersUseCase>(ListProvaidersUseCase)
  .to(ListProvaidersUseCase);

/* Users */

container.bind<IUserRepository>("UsersRepository").to(UsersRepository);
container.bind<CreateUsersUseCase>(CreateUsersUseCase).to(CreateUsersUseCase);
container.bind<ListUsersUseCase>(ListUsersUseCase).to(ListUsersUseCase);
container
  .bind<AuthenticatesessionsUseCase>(AuthenticatesessionsUseCase)
  .to(AuthenticatesessionsUseCase);
  

/* Upload Files */

container
  .bind<IStorageProvaider>("StorageProvaider")
  .to(selectedProviderStorage);

container
  .bind<UpdateAvatarUserUseCase>(UpdateAvatarUserUseCase)
  .to(UpdateAvatarUserUseCase);

/* Email Provider */

container.bind<IMailProvider>("EMailProvider").to(selectedProviderEmail);

container
  .bind<ResetPasswordEmailUseCase>(ResetPasswordEmailUseCase)
  .to(ResetPasswordEmailUseCase);
container
  .bind<SendForgotPasswordEmailUseCase>(SendForgotPasswordEmailUseCase)
  .to(SendForgotPasswordEmailUseCase);

/* Email Template Provaider */

container
  .bind<IMailTemplateProvaider>("HandlebarsMailTemplateProvider")
  .to(provaiderEmailTemplate.handlebars);

/* Tokens */

container
  .bind<IUserTokenRepository>("UserTokenRepository")
  .to(UserTokenRepository);

/*  Notifications */

container
  .bind<INotificationsRepository>("NotificationsRepository")
  .to(NotificationsRepository);

/*  Cache */

container.bind<ICacheProvaider>("CacheProvaider").to(provaiderCache.redis);

export { container };
