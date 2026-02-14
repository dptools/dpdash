import React, { useState } from 'react'

import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'

import api from '../api'
import PageHeader from '../components/PageHeader'
import { colorList } from '../fe-utils/colorList'
import ConfigForm from '../forms/ConfigForm'
import { UserConfigModel } from '../models'

const colors = colorList()

const NewConfigPage = () => {
  const { user, users, setNotification } = useOutletContext()
  const [assessmentOptions, setAssessmentOptions] = useState([])
  const { uid } = user
  const defaultValues = UserConfigModel.defaultFormValues({
    readers: [],
    owner: uid,
  })
  const friendsList = users
    .map(({ uid }) => ({ label: uid, value: uid }))
    .filter(({ label }) => label !== user.uid)

  const handleSubmitPublish = async (formValues) => {
    try {
      const newConfigurationAttributes = UserConfigModel.publishConfig(
        formValues,
        colors,
        uid
      )

      await api.userConfigurations.create(uid, newConfigurationAttributes)

      setNotification({
        open: true,
        message: 'Configuration Added',
      })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  const handleAssessmentSearch = async (e) => {
    const assessments = await api.assessments.loadAll({
      search: e.target.value,
    })
    const assessmentMenuOptions = assessments.map(({ name }) => name)

    setAssessmentOptions(assessmentMenuOptions)
  }

  const handleClear = async () => setAssessmentOptions([])

  const handleSubmitDraft = async (formValues) => {
    const newConfigurationAttributes = UserConfigModel.saveAsDraft(
      formValues,
      colors,
      uid
    )

    await api.userConfigurations.create(uid, newConfigurationAttributes)

    setNotification({
      open: true,
      message: 'Draft saved',
    })
  }

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader title="Create new configuration" isDescription />
      <ConfigForm
        colors={colors}
        friendsList={friendsList}
        onSubmit={handleSubmitPublish}
        initialValues={defaultValues}
        assessmentOptions={assessmentOptions}
        handleClear={handleClear}
        handleAssessmentSearch={handleAssessmentSearch}
        handleSubmitDraft={handleSubmitDraft}
      />
    </Box>
  )
}

export default NewConfigPage
