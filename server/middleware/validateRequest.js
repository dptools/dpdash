import * as yup from 'yup'

export const baseSchema = (overrides = {}) =>
  yup.object({
    body: yup.object(),
    params: yup.object(),
    query: yup.object(),
    ...overrides,
  })

async function validateRequest(schema, requestFields) {
  return await schema.validate(requestFields, {
    abortEarly: true,
  })
}

const validateMiddleware = (schema) => async (req, res, next) => {
  try {
    await validateRequest(schema, {
      body: req.body,
      params: req.params,
      query: req.query,
    })

    next()
  } catch (error) {
    return res.status(400).json({ error: 'Please enter valid information' })
  }
}

export default validateMiddleware
