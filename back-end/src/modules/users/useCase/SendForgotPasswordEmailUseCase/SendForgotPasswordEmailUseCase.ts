import "reflect-metadata";
import "dotenv/config"
import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { inject, injectable } from "inversify";
import { ISendForgotPasswordDTO } from "@modules/users/reporitories/dtos/ISendForgotPasswordDTO";
import { IMailProvider } from "@providers/EmailProvider/models/IMailProvider";
import { AppError } from "@shared/error/AppError";
import { IUserTokenRepository } from "@modules/users/reporitories/IUserTokenRepository";
import path from 'node:path'

@injectable()
class SendForgotPasswordEmailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,
    @inject("EMailProvider")
    private mailProvider: IMailProvider,
    @inject("UserTokenRepository")
    private userTokenRepository: IUserTokenRepository,
  ) { }

  public async execute({ email }: ISendForgotPasswordDTO): Promise<void> {

    const checkEmailExists = await this.usersRepository.findByEmail(email)

    if (!checkEmailExists) {
      throw new AppError('E-mail does not exists')
    }

    const { token } = await this.userTokenRepository.generate(checkEmailExists.id)

    const forgotPasswordTemplate = path.resolve(__dirname, '..', '..', 'templates', 'forgot_password.hbs')

    await this.mailProvider.sendMail({
      to: {
        name: checkEmailExists.name,
        email: checkEmailExists.email
      },
      subject: '[GoBaber] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: checkEmailExists.name,
          link: `${process.env.APP_WEB_URL_DEVELOPMENT}/reset?token=${token}`
        }
      }
    })
  }
}

export { SendForgotPasswordEmailUseCase };
