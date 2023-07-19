import React from 'react'
import { GridList } from '@material-ui/core'
import ConfigAssessmentFormFields from '../ConfigAssessmentFormFields'
import ConfigTypeFormFields from '../ConfigTypeFormFields'

const ConfigFormFields = ({
  classes,
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
      <GridList
        cellHeight="auto"
        className={classes.configurationListGrid}
        cols={gridState.columns}
      >
        {fields.map((field, index) => {
          const { id, ...rest } = field

          return (
            <ConfigAssessmentFormFields
              classes={classes}
              colors={colors}
              control={control}
              index={index}
              key={id}
              id={id}
              onCopy={onCopy}
              onRemove={onRemove}
              width={gridState.gridWidth}
              {...rest}
            />
          )
        })}
      </GridList>
    </>
  )
}

export default ConfigFormFields
