import React, { useState, useEffect } from 'react'

import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useParams, useOutletContext } from 'react-router-dom'

import api from '../api'
import PageHeader from '../components/PageHeader'
import { colorList } from '../fe-utils/colorList'
import ConfigForm from '../forms/ConfigForm'
import { UserConfigModel } from '../models'

const colors = colorList()

const EditConfigPage = () => {
  const { user, setNotification, users } = useOutletContext()
  const [assessmentOptions, setAssessmentOptions] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(true)
  const { config_id } = useParams()
  const friendsList = users
    .map(({ uid }) => ({ label: uid, value: uid }))
    .filter(({ label }) => label !== user.uid)
  const { uid } = user

  const handleSubmitPublish = async (formValues) => {
    try {
      const updatedConfiguration = UserConfigModel.publishConfig(
        formValues,
        colors,
        uid
      )
      await api.userConfigurations.update(uid, config_id, updatedConfiguration)

      setNotification({
        open: true,
        message: 'Configuration Added',
      })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const fetchCurrentConfig = async () => {
    try {
      const data = await api.userConfigurations.findOne(uid, config_id)

      return UserConfigModel.processConfigToFormFields(data, colors)
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }
  const handleAssessmentSearch = async (e) => {
    const assessments = await api.assessments.loadAll({
      search: e.target.value,
    })
    const assessmentMenuOptions = assessments.map(({ name }) => name)

    setAssessmentOptions(assessmentMenuOptions)
  }

  const handleClearAssessments = async () => setAssessmentOptions([])
  const handleSubmitDraft = async (formValues) => {
    const newConfigurationAttributes = UserConfigModel.saveAsDraft(
      formValues,
      colors,
      uid
    )
    await api.userConfigurations.update(
      uid,
      config_id,
      newConfigurationAttributes
    )

    setNotification({
      open: true,
      message: 'Draft saved',
    })
  }

  useEffect(() => {
    fetchCurrentConfig().then((values) => {
      setInitialValues(values)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Depending on the size, this may take a while...</div>

  return (
    <Box sx={{ p: '30px' }}>
      <PageHeader
        title={initialValues.configName}
        cta={
          initialValues.status === 0 ? (
            <Typography variant="body2" sx={{ color: 'grey.A100' }}>
              Saved as draft: {dayjs(initialValues.updatedAt).format('llll')}
            </Typography>
          ) : null
        }
        isDescription
      />
      <ConfigForm
        assessmentOptions={assessmentOptions}
        colors={colors}
        friendsList={friendsList}
        onSubmit={handleSubmitPublish}
        initialValues={initialValues}
        handleClearAssessments={handleClearAssessments}
        handleAssessmentSearch={handleAssessmentSearch}
        handleSubmitDraft={handleSubmitDraft}
      />
    </Box>
  )
}

export default EditConfigPage
