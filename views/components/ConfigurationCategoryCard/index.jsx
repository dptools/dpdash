import React from 'react'
import { Card, CardActions, CardContent, IconButton } from '@mui/material'
import { Delete, ContentCopy } from '@mui/icons-material'

const ConfigurationCategoryCard = ({
  children,
  formIndex,
  onCopy,
  onRemove,
  rowNum,
}) => {
  return (
    <Card sx={{ width: '300px' }}>
      <CardContent>{children}</CardContent>
      <CardActions>
        <IconButton aria-label="delete" onClick={() => onRemove(formIndex)}>
          <Delete />
        </IconButton>
        <IconButton aria-label="copy" onClick={() => onCopy(formIndex)}>
          <ContentCopy />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCategoryCard
