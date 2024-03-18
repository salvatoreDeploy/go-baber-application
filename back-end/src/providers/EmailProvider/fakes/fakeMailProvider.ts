import ISendMailDTO from "../dtos/ISendMailDTO";
import { IMailProvider } from "../models/IMailProvider";



class FakeMailProvider implements IMailProvider {
  private messeages: ISendMailDTO[] = []

  async sendMail(message: ISendMailDTO): Promise<void> {
    this.messeages.push(message)
  }

}

export { FakeMailProvider };