import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'

import ChartForm from '../forms/ChartForm'
import { editChart, getChart } from '../fe-utils/fetchUtil'
import { routes } from '../routes/routes'

const EditChartPage = () => {
  const { chart_id } = useParams()
  const [chart, setChart] = useState()
  const { user, classes, navigate } = useOutletContext()

  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    const { data } = await editChart(chart_id, formValues)

    if (data.modifiedCount === 1) navigate(routes.viewChart(chart_id))
  }

  useEffect(() => {
    getChart(chart_id).then(({ data }) => setChart(data))
  }, [chart_id])

  if (!chart) return null

  return (
    <>
      <ChartForm
        classes={classes}
        handleSubmit={handleSubmit}
        initialValues={chart}
        studies={user.access}
      />
    </>
  )
}

export default EditChartPage
