import BaseMailer from './BaseMailer'

export default class AdminAccountPasswordMailer extends BaseMailer {
  constructor(resetKey) {
    super({ to: [process.env.ADMIN_EMAIL], from: process.env.EMAIL_SENDER })
    this.subject = 'Admin Account Created'
    this.resetKey = resetKey
  }

  async body() {
    return `You've installed DPdash! Your username is "admin". Your password reset token is ${this.resetKey}`
  }
}
