import { renderFile } from 'ejs'
import path from 'path'
import BaseMailer from './BaseMailer'

export default class RegistrationMailer extends BaseMailer {
  constructor(user) {
    super({ to: [process.env.ADMIN_EMAIL], from: process.env.EMAIL_SENDER })
    this.subject = 'New Registered User'
    this.user = user
    this.redirectUrl = process.env.HOME_URL
  }

  async body() {
    const registrationEmailTemplate = path.join(
      __dirname,
      'templates',
      'registrationTemplate.ejs'
    )

    return await renderFile(registrationEmailTemplate, {
      ...this.user,
      redirect: this.redirectUrl,
    })
  }
}
