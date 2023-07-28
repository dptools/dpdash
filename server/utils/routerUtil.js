import * as yup from 'yup'

const getConfigSchema = () => {
  return yup.array().of(
    yup.object().shape({
      analysis: yup.string().required(),
      category: yup.string(),
      color: yup.array().of(yup.string()).required(),
      label: yup.string().required(),
      variable: yup.string().required(),
      text: yup.boolean().required(),
      range: yup.array().of(yup.number()).length(2).required(),
    })
  )
}

export { getConfigSchema }
