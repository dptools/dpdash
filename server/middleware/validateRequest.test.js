import validateMiddleware, { baseSchema } from './validateRequest'
import * as yup from 'yup'
import { createRequest, createResponse } from '../../test/fixtures'

describe(validateMiddleware, () => {
  it('returns an error message when inputs are nonvalid', async () => {
    const req = createRequest({
      body: { nonexistant: 1 },
      params: { uid: 'some-id' },
      query: {},
    })
    const res = createResponse()
    const next = jest.fn()
    const schema = baseSchema({
      body: yup.object({
        exists: yup.string().required(),
      }),
      params: yup.object({ uid: yup.string().required() }),
    })

    await validateMiddleware(schema)(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'body.exists is a required field',
    })
  })

  it('continues with logic if no errors', async () => {
    const req = createRequest({
      body: { exists: 'string' },
      params: { uid: 'some-id' },
      query: {},
    })
    const res = createResponse()
    const next = jest.fn()
    const schema = baseSchema({
      body: yup.object({
        exists: yup.string().required(),
      }),
      params: yup.object({ uid: yup.string().required() }),
    })

    await validateMiddleware(schema)(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
