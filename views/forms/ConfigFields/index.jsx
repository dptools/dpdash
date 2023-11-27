import React from 'react'
import { ImageList } from '@mui/material'
import ConfigAssessmentFormFields from '../ConfigAssessmentFormFields'
import ConfigTypeFormFields from '../ConfigTypeFormFields'

const ConfigFormFields = ({
  control,
  colors,
  fields,
  friendsList,
  gridState,
  onCopy,
  onRemove,
}) => {
  return (
    <>
      <ConfigTypeFormFields control={control} friendsList={friendsList} />
      <ImageList cols={4}>
        {fields.map((field, index) => {
          const { id, ...rest } = field

          return (
            <ConfigAssessmentFormFields
              colors={colors}
              control={control}
              index={index}
              key={id}
              id={id}
              onCopy={onCopy}
              onRemove={onRemove}
              {...rest}
            />
          )
        })}
      </ImageList>
    </>
  )
}

export default ConfigFormFields
