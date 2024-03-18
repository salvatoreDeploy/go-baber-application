import { EtherealMailProvider}  from './implementations/EtheralMailProvider'
import { SESMailProvider } from './implementations/SESMailProvaider'
import { Container } from 'inversify'
import { IMailProvider } from './models/IMailProvider'
import IMailTemplateProvaider from '../MailTemplateProvider/models/IMailTemplateProvaider'
import mailConfig from "@config/Mail";

// Mapeamento de configuração para provedor de e-mail

const providerMap: { [key: string]: new (mailTemplateProvider: IMailTemplateProvaider) => IMailProvider } = {
  // Adicione outras opções conforme necessário

  'ethereal': EtherealMailProvider,
  'ses': SESMailProvider,

};

// Se a opção de configuração não estiver no mapa, use Ethereal como padrão

export const selectedProviderEmail = providerMap[mailConfig.driver] || EtherealMailProvider;

