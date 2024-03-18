import 'dotenv/config'

interface IMailConfig{
  driver: 'ethereal' | 'ses'
  defaults: {
    from: {
      email: string,
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER_DEVELOPMENT || 'ethereal',
  defaults: {
    from: {
      email: 'projetosdeploy@gmail.com',
      name: 'Henrique Araujo'
    }
  }
} as IMailConfig