import IParseMailTemplateDRO from "../dtos/IParseMailTemplateDTO";

export default interface IMailTemplateProvaider {
  parse(data: IParseMailTemplateDRO): Promise<string>
}