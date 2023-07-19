import React from 'react'
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import Copy from '@material-ui/icons/FileCopy'

const ConfigurationCategoryCard = ({
  children,
  classes,
  formIndex,
  onCopy,
  onRemove,
  rowNum,
  width,
}) => {
  return (
    <Card
      className={classes.configurationCategoryCard}
      style={{ width: width }}
    >
      <CardHeader
        className={classes.configurationCategoryCardHeader}
        subheader={'Row ' + rowNum}
      ></CardHeader>
      <Divider />
      <CardContent>{children}</CardContent>
      <CardActions className={classes.configurationCategoryCardActions}>
        <IconButton
          aria-label="delete"
          className={classes.categoryButtons}
          onClick={() => onRemove(formIndex)}
        >
          <Delete />
        </IconButton>
        <IconButton
          aria-label="copy"
          className={classes.categoryButtons}
          onClick={() => onCopy(formIndex)}
        >
          <Copy />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCategoryCard
