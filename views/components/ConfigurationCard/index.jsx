import React from 'react'
import moment from 'moment'
import {
  Card,
  CardHeader,
  Divider,
  Typography,
  CardActions,
  Switch,
  IconButton,
  FormControlLabel,
  Tooltip,
} from '@material-ui/core'
import { Edit, Clear, Share } from '@material-ui/icons'
import FullView from '@material-ui/icons/AspectRatio'
import Copy from '@material-ui/icons/FileCopy'
import ConfigCardAvatar from '../ConfigurationCardAvatar'

const ConfigurationCard = ({
  classes,
  config,
  onCopyConfig,
  onEditConfig,
  onRemoveOrUpdateConfig,
  onUpdatePreferences,
  onViewConfig,
  openSearch,
  preferences,
  user,
  width,
}) => {
  const { uid } = user
  const { _id, name, owner, readers, type } = config
  const ownsConfig = uid === owner
  const showTime = config.modified || config.created
  const localTime = moment.utc(showTime).local().format()
  const updated = moment(localTime).calendar()
  const checked = config._id === preferences.config

  return (
    <Card style={{ margin: '3px', width: `${width}px` }}>
      <CardHeader
        title={owner}
        subheader={updated}
        avatar={<ConfigCardAvatar config={config} currentUser={user} />}
        action={
          <IconButton onClick={() => onRemoveOrUpdateConfig(ownsConfig, _id)}>
            <Clear />
          </IconButton>
        }
      />
      <Divider />
      <div className={classes.actionsDivider}>
        <Typography variant="headline" component="h3" noWrap>
          {name}
        </Typography>
        <Typography className={classes.textAndIcon} component="p">
          {type}
        </Typography>
      </div>
      <CardActions className={classes.actionsContainer}>
        <FormControlLabel
          control={
            <Switch
              className={classes.textAndIcon}
              checked={checked}
              onChange={() => onUpdatePreferences(_id)}
            />
          }
          label="Default"
        />
        <div>
          {ownsConfig ? (
            <>
              <Tooltip title="Edit" placement="top">
                <IconButton
                  onClick={() => onEditConfig(_id)}
                  className={classes.textAndIcon}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share" placement="top">
                <IconButton
                  className={classes.textAndIcon}
                  onClick={() => openSearch(config)}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {' '}
              <Tooltip title="View" placement="top">
                <IconButton
                  onClick={() => onViewConfig(_id)}
                  className={classes.textAndIcon}
                >
                  <FullView />
                </IconButton>
              </Tooltip>
              <Tooltip title="Duplicate" placement="top">
                <IconButton
                  className={classes.textAndIcon}
                  onClick={() => onCopyConfig(config)}
                >
                  <Copy />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCard
