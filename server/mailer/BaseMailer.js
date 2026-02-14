import { SES } from '@aws-sdk/client-ses'
import { createTransport } from 'nodemailer'

export default class BaseMailer {
  constructor({ to, from }) {
    this.to = to
    this.from = from
  }

  async sendMail() {
    return this.mailService.sendEmail(await this.emailParams())
  }

  get mailService() {
    if (process.env.SMTP_HOST) {
      return {
        sendEmail: async (params) => {
          const transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
            tls: {
              // to not fail on invalid certs:
              // set SMTP_REJECT_UNAUTHORIZED=false in .env file
              rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED == 'true',
            },
          })

          return await transporter.sendMail({
            from: params.Source,
            to: params.Destination.ToAddresses,
            subject: params.Message.Subject.Data,
            html: params.Message.Body.Html.Data,
          })
        },
      }
    }
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
