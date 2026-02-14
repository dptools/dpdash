import React from 'react'

import ConfigAssessmentFormFields from '../ConfigAssessmentFormFields'
import ConfigTypeFormFields from '../ConfigTypeFormFields'

import './ConfigFields.css'

const ConfigFormFields = ({
  control,
  colors,
  fields,
  friendsList,
  onCopy,
  onRemove,
  assessmentOptions,
  handleAssessmentSearch,
  handleClearAssessments,
  handleClearUsers,
  handleSelectAllUsers,
}) => {
  return (
    <>
      <ConfigTypeFormFields
        control={control}
        friendsList={friendsList}
        handleClearUsers={handleClearUsers}
        handleSelectAllUsers={handleSelectAllUsers}
      />
      <div className="ConfigFields">
        {fields.map((field, index) => {
          const { id, ...rest } = field

          return (
            <ConfigAssessmentFormFields
              colors={colors}
              control={control}
              index={index}
              id={id}
              key={id}
              onCopy={onCopy}
              onRemove={onRemove}
              assessmentOptions={assessmentOptions}
              handleClearAssessments={handleClearAssessments}
              handleAssessmentSearch={handleAssessmentSearch}
              {...rest}
            />
          )
        })}
      </div>
    </>
  )
}

export default ConfigFormFields
