import Handlebars from "handlebars";
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvaider from "../models/IMailTemplateProvaider";
import fs from 'node:fs'
import { injectable } from "inversify";

@injectable()
class HandlebarsMailTemplateProvider implements IMailTemplateProvaider {
  async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {

    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8'
    })

    const parseTemplate = Handlebars.compile(templateFileContent)

    return parseTemplate(variables)
  }
}

export { HandlebarsMailTemplateProvider }