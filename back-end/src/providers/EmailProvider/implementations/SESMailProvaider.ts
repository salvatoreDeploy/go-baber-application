import IMailTemplateProvaider from "@providers/MailTemplateProvider/models/IMailTemplateProvaider"
import ISendMailDTO from "../dtos/ISendMailDTO"
import { IMailProvider } from "../models/IMailProvider"
import nodemailer, { Transporter } from 'nodemailer'
import { inject, injectable } from "inversify"
import aws from 'aws-sdk'
import mailConfig from "@config/Mail"

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-2",
  signatureVersion: 'v4'
});

@injectable()
class SESMailProvider implements IMailProvider {

  private client: Transporter | null = null

  constructor(@inject('HandlebarsMailTemplateProvider') private mailTemplateProvider: IMailTemplateProvaider) {
    this.client = nodemailer.createTransport({
      SES: {aws, ses}
    })
  }

  async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void> {
    const {email, name} = mailConfig.defaults.from

    if (!this.client) {
      return
    }

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email
      },
      to: {
        name: to.name, address: to.email
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData)
    })
  }
}

export { SESMailProvider }