import React from 'react'
import { useOutletContext } from 'react-router-dom'

import ChartForm from '../forms/ChartForm'
import { createChart } from '../fe-utils/fetchUtil'
import { targetValuesFields } from '../fe-utils/targetValuesUtil'
import { routes } from '../routes/routes'
import { colors } from '../../constants/styles'

const initialValues = (user) => ({
  title: '',
  description: '',
  assessment: '',
  variable: '',
  fieldLabelValueMap: [
    {
      value: '',
      label: '',
      color: colors.dark_sky_blue,
      targetValues: targetValuesFields(user.access),
    },
  ],
  public: false,
})

const NewChartPage = () => {
  const { user, classes, navigate } = useOutletContext()
  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    const { data } = await createChart(formValues)
    navigate(routes.viewChart(data.chart_id))
  }

  return (
    <>
      <ChartForm
        classes={classes}
        handleSubmit={handleSubmit}
        initialValues={initialValues(user)}
        studies={user.access}
      />
    </>
  )
}

export default NewChartPage
