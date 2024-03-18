import IMailTemplateProvaider from "@providers/MailTemplateProvider/models/IMailTemplateProvaider"
import ISendMailDTO from "../dtos/ISendMailDTO"
import { IMailProvider } from "../models/IMailProvider"
import nodemailer, { TestAccount, Transporter } from 'nodemailer'
import { inject, injectable } from "inversify"


@injectable()
class EtherealMailProvider implements IMailProvider {

  private client: Transporter


  constructor(@inject('HandlebarsMailTemplateProvider') private mailTemplateProvider: IMailTemplateProvaider) {

    /* 
    Esta forma de criar o client esta com problema outra forma foi criar uma autenticação
    no site https://ethereal.email/create
    
    nodemailer.createTestAccount().then(testAccount => {
      this.account = testAccount;
      this.transporter = nodemailer.createTransport({
        host: this.account.smtp.host,
        port: this.account.smtp.port,
        secure: this.account.smtp.secure,
        auth: {
          user: this.account.user,
          pass: this.account.pass,
        },
      });
    });
    */
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'rusty22@ethereal.email',
        pass: 'fq5yZECQTfpPWnSTcP'
      }
    });

    this.client = transporter
  }

  async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void> {

    const message = await this.client.sendMail({
      from: {
        name: from?.name || "Equipe Projetos Deploy",
        address: from?.email || "projetosDeploy@gmail.com"
      },
      to: {
        name: to.name, address: to.email
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData)
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}

export { EtherealMailProvider }