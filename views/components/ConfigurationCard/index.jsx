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
} from '@material-ui/core'
import { Edit, Clear, Share } from '@material-ui/icons'
import FullView from '@material-ui/icons/AspectRatio'
import Copy from '@material-ui/icons/FileCopy'
import ConfigCardAvatar from '../ConfigurationCardAvatar'
import openNewWindow from '../../fe-utils/windowUtil'
import { routes } from '../../routes/routes'
import { colors } from '../../../constants'

const ConfigurationCard = ({
  classes,
  config,
  onCopyConfig,
  onRemoveOrUpdateConfig,
  onUpdatePreferences,
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
            <Clear color={colors.gray} />
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
              labelStyle={classes.textAndIcon}
              checked={checked}
              onChange={() => onUpdatePreferences(_id)}
            />
          }
          label="Default"
        />
        <div>
          {ownsConfig ? (
            <>
              <IconButton
                onClick={() => openNewWindow(routes.editConfiguration(_id))}
                iconStyle={classes.textAndIcon}
                tooltipPosition="top-center"
                tooltip="Edit"
              >
                <Edit />
              </IconButton>
              <IconButton
                iconStyle={classes.textAndIcon}
                tooltipPosition="top-center"
                tooltip="Share"
                onClick={() => openSearch(config)}
              >
                <Share />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                onClick={() => openNewWindow(routes.viewConfiguration(_id))}
                iconStyle={classes.textAndIcon}
                tooltipPosition="top-center"
                tooltip="View"
              >
                <FullView />
              </IconButton>
              <IconButton
                iconStyle={classes.textAndIcon}
                tooltipPosition="top-center"
                tooltip="Duplicate"
                onClick={() => onCopyConfig(config)}
              >
                <Copy />
              </IconButton>
            </>
          )}
        </div>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCard
