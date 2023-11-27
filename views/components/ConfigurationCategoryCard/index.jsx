import React from 'react'
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
} from '@mui/material'
import { Delete, ContentCopy } from '@mui/icons-material'

const ConfigurationCategoryCard = ({
  children,
  formIndex,
  onCopy,
  onRemove,
  rowNum,
}) => {
  return (
    <Card sx={{ maxWidth: '552px' }}>
      <CardHeader subheader={'Row ' + rowNum}></CardHeader>
      <Divider />
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
