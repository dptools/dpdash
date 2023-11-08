import { SES } from '@aws-sdk/client-ses'

export default class BaseMailer {
  constructor({ to, from }) {
    this.to = to
    this.from = from
  }

  async sendMail() {
    return this.mailService.sendEmail(await this.emailParams())
  }

  get mailService() {
    return new SES({ apiVersion: '2010-12-01', region: 'us-east-1' })
  }

  async emailParams() {
    return {
      Destination: {
        ToAddresses: this.to,
      },
      Source: this.from,
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: await this.body(),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: this.subject,
        },
      },
    }
  }
}
