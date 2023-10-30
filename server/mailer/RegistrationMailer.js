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

  get body() {
    const registrationEmailTemplate = path.join(
      __dirname,
      'mailer',
      'templates',
      'registrationTemplate.ejs'
    )

    return renderFile(registrationEmailTemplate, {
      ...user,
      redirect: this.redirectUrl,
    })
  }
}
