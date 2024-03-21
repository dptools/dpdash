import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const FormProviderFixture = ({ children }) => {
  const methods = useForm()

  return <FormProvider {...methods}>{children}</FormProvider>
}

export default FormProviderFixture
