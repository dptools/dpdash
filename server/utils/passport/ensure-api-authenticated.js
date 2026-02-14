import { timingSafeEqual } from 'crypto'

export function ensureApiAuthenticated(req, res, next) {
  const apiUsers = process.env.IMPORT_API_USERS.split(',')
  const apiKeys = process.env.IMPORT_API_KEYS.split(',')

  const userHeader = req.headers['x-api-user']
  const keyHeader = req.headers['x-api-key']

  if (!userHeader || !keyHeader) {
    return res.status(401).send({ error: 'Unauthorized' })
  }

  let isAuthenticated = false
  apiUsers.forEach((apiUser, index) => {
    const apiUserBuffer = Buffer.from(apiUser, 'utf8')
    const userHeaderBuffer = Buffer.from(userHeader, 'utf8')
    if (apiUserBuffer.length === userHeaderBuffer.length) {
      if (timingSafeEqual(apiUserBuffer, userHeaderBuffer)) {
        const apiKeyBuffer = Buffer.from(apiKeys[index], 'utf8')
        const keyHeaderBuffer = Buffer.from(keyHeader, 'utf8')
        if (apiKeyBuffer.length === keyHeaderBuffer.length) {
          if (timingSafeEqual(apiKeyBuffer, keyHeaderBuffer)) {
            isAuthenticated = true
          }
        }
      }
    }
  })

  if (!isAuthenticated) {
    return res.status(401).send({ error: 'Unauthorized' })
  }

  return next()
}
