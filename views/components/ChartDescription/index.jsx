import React from 'react'
import { Button, Typography } from '@mui/material'
import { fontSize, lineHeight } from '../../../constants'

const ChartDescription = ({
  description,
  shortDescription,
  onExpand,
  sx,
  expanded,
}) => {
  return (
    <Typography
      variant="subtitle1"
      style={{
        ...sx,
        overflow: 'hidden',
        lineHeight: lineHeight[28],
        fontSize: fontSize[14],
      }}
    >
      {expanded ? description : shortDescription}
      <Button
        onClick={onExpand}
        variant="text"
        size="medium"
        sx={{
          minHeight: 0,
          minWidth: 0,
          p: 0,
          textTransform: 'capitalize',
        }}
      >
        {expanded ? 'less' : 'more'}
      </Button>
    </Typography>
  )
}

export default ChartDescription
