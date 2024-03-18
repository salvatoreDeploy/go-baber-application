import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvaider from "../models/IMailTemplateProvaider";

class FakeMailTemplateProvider implements IMailTemplateProvaider {

  public file = 'path-template'

  async parse({ file }: IParseMailTemplateDTO): Promise<string> {
    return file
  }
}

export { FakeMailTemplateProvider }