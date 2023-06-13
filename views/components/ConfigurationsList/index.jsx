import React, { useState, useEffect } from 'react'
import moment from 'moment'
import classNames from 'classnames'
import 'whatwg-fetch'
import Select from 'react-select'
import update from 'immutability-helper'

import AttachFile from '@material-ui/icons/AttachFile'
import Button from '@material-ui/core/Button'
import CancelIcon from '@material-ui/icons/Cancel'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Chip from '@material-ui/core/Chip'
import Clear from '@material-ui/icons/Clear'
import Copy from '@material-ui/icons/FileCopy'
import ContentAdd from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Edit from '@material-ui/icons/Edit'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FullView from '@material-ui/icons/AspectRatio'
import GridList from '@material-ui/core/GridList'
import IconButton from '@material-ui/core/IconButton'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Share from '@material-ui/icons/Share'
import Snackbar from '@material-ui/core/Snackbar'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ConfigCardAvatar from '../ConfigurationCardAvatar'

import { fetchUsernames } from '../../fe-utils/fetchUtil'
import openNewWindow from '../../fe-utils/windowUtil'
import { apiRoutes, routes } from '../../routes/routes'

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  )
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  )
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  )
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      <MenuList>{props.children}</MenuList>
    </Paper>
  )
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
}
const ConfigurationsList = ({ user, classes, theme }) => {
  const userMessageLength = user.message.length
  const [state, setState] = useState({
    user: {},
    preferences: {},
    configurations: [],
    gridCols: 1,
    gridWidth: 350,
    searchUsers: false,
    friends: [],
    shared: [],
    snackTime: false,
    uploadSnack: false,
    selectedConfig: {},
    configOwner: '',
    totalStudies: 0,
    totalSubjects: 0,
    totalDays: 0,
  })
  const minimumInnerWidth = 768
  const gridColumnsDivisor = 350

  useEffect(() => {
    loadUserNames()
    handleResize()
    fetchConfigurations(user.uid).then(({ data }) => {
      setState((prevState) => {
        return {
          ...prevState,
          configurations: data,
        }
      })
    })
    fetchPreferences(user.uid)
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (user.message.length > 0) {
      setState((prevState) => {
        return {
          ...prevState,
          uploadSnack: true,
        }
      })
    }
  }, [userMessageLength])

  const loadUserNames = async () => {
    try {
      const usernames = await fetchUsernames()
      setState((prevstate) => {
        return {
          ...prevstate,
          friends: usernames.map((username) => ({
            value: username,
            label: username,
          })),
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleResize = () => {
    if (window.innerWidth >= minimumInnerWidth) {
      const gridCols = Math.floor(window.innerWidth / gridColumnsDivisor)
      setState((prevState) => {
        return { ...prevState, gridCols: gridCols }
      })
    } else if (gridCols !== 1) {
      setState((prevState) => {
        return { ...prevState, gridCols: 1 }
      })
    }
  }
  const babyProofPreferences = (preferences) => {
    let preference = {}
    preference['star'] = preferences['star'] || {}
    preference['sort'] = preferences['sort'] || 0
    preference['config'] = preferences['config'] || ''
    preference['complete'] = preferences['complete'] || {}
    return preference
  }
  const updateUserPreferences = (index, type) => {
    let { uid } = user
    let preference = {}
    if (type === 'index') {
      if (state.configurations.length > 0 && state.configurations[index]) {
        preference['config'] = state.configurations[index]['_id']
      }
    } else {
      preference['config'] = index
    }
    preference['complete'] = state.preferences['complete'] || {}
    preference['star'] = state.preferences['star'] || {}
    preference['sort'] = state.preferences['sort'] || 0
    preference = babyProofPreferences(preference)

    return window
      .fetch(apiRoutes.users.preferences(uid), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          preferences: preference,
        }),
      })
      .then(() => {
        if (type == 'index') {
          setState((prevState) => {
            return {
              ...prevState,
              preferences: preference,
              snackTime: true,
            }
          })
        } else {
          setState((prevState) => {
            return {
              ...prevState,
              preferences: preference,
            }
          })
        }
      })
  }
  const fetchPreferences = (uid) => {
    return window
      .fetch(apiRoutes.users.user(uid), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      })
      .then((response) => {
        if (response.status !== 200) {
          return
        }
        return response.json()
      })
      .then(({ data }) => {
        setState((prevState) => {
          return {
            ...prevState,
            preferences: babyProofPreferences(data.preferences),
          }
        })
      })
  }
  const removeConfiguration = async (_id) => {
    return window
      .fetch(apiRoutes.configurations.userConfiguration(user.uid, _id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        if (response.status === 200) {
        }
      })
  }
  const fetchConfigurations = async (uid) => {
    try {
      const response = await window.fetch(
        apiRoutes.configurations.userConfigurations(uid),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
        }
      )
      if (response.status !== 200) return
      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  }
  const updateConfiguration = (configID, configAttributes) => {
    window
      .fetch(apiRoutes.configurations.userConfiguration(user.uid, configID), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(configAttributes),
      })
      .then((res) => {
        if (res.status === 200) {
          fetchConfigurations(user.uid).then(({ data }) => {
            setState((prevState) => {
              return {
                ...prevState,
                configurations: data,
              }
            })
          })
        }
      })
  }

  const handleCrumbs = () => {
    setState((prevState) => {
      return {
        ...prevState,
        snackTime: false,
        uploadSnack: false,
      }
    })
  }
  const removeConfig = (configs, index, configID) => {
    removeConfiguration(configID)
    setState((prevState) => {
      return {
        ...prevState,
        configurations: update(configs, {
          $splice: [[index, 1]],
        }),
        snackTime: true,
      }
    })
    if (index == state.preferences['config']) {
      updateUserPreferences(0, 'index')
    }
  }
  const openSearchUsers = (index, configID, shared, owner) => {
    setState((prevState) => {
      return {
        ...prevState,
        searchUsers: true,
        selectedConfig: {
          _id: configID,
          index: index,
        },
        shared: shared.map((friend) => ({
          label: friend,
          value: friend,
        })),
        configOwner: owner,
      }
    })
  }
  const closeSearchUsers = () => {
    setState((prevState) => {
      return {
        ...prevState,
        searchUsers: false,
        selectedConfig: {
          _id: '',
          index: -1,
        },
        shared: [],
        configOwner: '',
      }
    })
  }
  const copyConfig = (configuration) => {
    const { _id, ...configAttributes } = configuration
    const newConfig = {
      ...configAttributes,
      owner: user.uid,
      readers: [user.uid],
      created: new Date().toUTCString(),
    }

    return window
      .fetch(apiRoutes.configurations.userConfigurations(uid), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(newConfig),
      })
      .then((response) => {
        if (response.status == 201) {
          fetchConfigurations(user.uid).then(({ data }) => {
            setState((prevState) => {
              return {
                ...prevState,
                configurations: data,
              }
            })
          })
        }
      })
  }

  const generateCards = (configs, preference) => {
    let cards = []
    if (configs && configs.length > 0) {
      for (let item in configs) {
        const configuration = configs[item]
        const { _id } = configuration
        const ownsConfig = user.uid === configs[item]['owner']
        const showTime = configs[item].modified || configs[item].created
        const localTime = moment.utc(showTime).local().format()
        const updated = moment(localTime).calendar()

        cards.push(
          <Card style={{ margin: '3px' }}>
            <CardHeader
              title={configs[item]['owner']}
              subheader={updated}
              avatar={
                <ConfigCardAvatar config={configs[item]} currentUser={user} />
              }
              action={
                <IconButton
                  onClick={() => {
                    if (ownsConfig) {
                      removeConfig(configs, item, _id)
                    } else {
                      const configAttributes = {
                        readers: config.readers.filter(
                          (reader) => reader !== user.uid
                        ),
                      }
                      updateConfiguration(_id, configAttributes)
                    }
                  }}
                >
                  <Clear color="rgba(0, 0, 0, 0.54)" />
                </IconButton>
              }
            />
            <Divider />
            <div style={{ padding: '16px 24px' }}>
              <Typography variant="headline" component="h3">
                {configs[item]['name']}
              </Typography>
              <Typography
                style={{
                  color: 'rgba(0, 0, 0, 0.54)',
                }}
                component="p"
              >
                {configs[item]['type']}
              </Typography>
            </div>
            <CardActions>
              <div
                style={{
                  padding: '0px',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                <div style={{ float: 'right' }}>
                  {ownsConfig ? (
                    <IconButton
                      onClick={() =>
                        openNewWindow(routes.editConfiguration(_id))
                      }
                      iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      tooltipPosition="top-center"
                      tooltip="Edit"
                    >
                      <Edit />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() =>
                        openNewWindow(routes.viewConfiguration(_id))
                      }
                      iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      tooltipPosition="top-center"
                      tooltip="View"
                    >
                      <FullView />
                    </IconButton>
                  )}
                  {ownsConfig ? (
                    <IconButton
                      iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      tooltipPosition="top-center"
                      tooltip="Share"
                      onClick={() =>
                        openSearchUsers(
                          item,
                          configs[item]['_id'],
                          configs[item]['readers'],
                          configs[item]['owner']
                        )
                      }
                    >
                      <Share />
                    </IconButton>
                  ) : (
                    <IconButton
                      iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      tooltipPosition="top-center"
                      tooltip="Duplicate"
                      onClick={() => copyConfig(configs[item])}
                    >
                      <Copy />
                    </IconButton>
                  )}
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      style={{
                        width: 'auto',
                      }}
                      labelStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      checked={
                        'config' in preference
                          ? configs[item]['_id'] == preference['config']
                          : false
                      }
                      onChange={(e, isInputChecked) =>
                        changeDefaultConfig(e, isInputChecked, item)
                      }
                    />
                  }
                  label="Default"
                />
              </div>
            </CardActions>
          </Card>
        )
      }
    }
    return cards
  }
  const shareWithUsers = () => {
    const { _id } = state.selectedConfig
    const configAttributes = {
      readers: state.shared.map((sharedWith) => sharedWith.value),
    }

    return window
      .fetch(apiRoutes.configurations.userConfiguration(user.uid, _id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(configAttributes),
      })
      .then((response) => {
        if (response.status === 200) {
          setState((prevState) => {
            return {
              ...prevState,
              configurations: update(state.configurations, {
                [state.selectedConfig['index']]: {
                  ['readers']: {
                    $set: state.shared.map((o) => {
                      return o.value
                    }),
                  },
                },
              }),
            }
          })
        }
        closeSearchUsers()
      })
  }
  const handleChange = (name) => (value) => {
    let uid = user.uid
    let names = value.map((o) => {
      return o.value
    })
    if (names.indexOf(uid) === -1) {
      throw new Error('Unable to delete owner.')
    }
    setState((prevState) => {
      return { ...prevState, [name]: value }
    })
  }
  const handleChangeFile = (e) => {
    e.preventDefault()
    const file = e.target.files ? e.target.files[0] : ''
    new Response(file)
      .json()
      .then(async (json) => {
        const res = await window.fetch(
          apiRoutes.configurations.configurationFileUpload(user.uid),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(json),
          }
        )
        if (res.status === 200) {
          window.location = routes.configurationSuccess
        } else if (res.status === 400) {
          window.location = routes.invalidConfiguration
        } else {
          window.location = routes.configurationError
        }
      })
      .catch((err) => {
        throw new Error(err)
      })
  }
  const changeDefaultConfig = (e, checked, index) => {
    updateUserPreferences(index, 'index')
  }

  const actions = [
    <Button
      onClick={closeSearchUsers}
      style={{
        color: '#5790bd',
      }}
      key="cancel"
    >
      Cancel
    </Button>,
    <Button
      variant="outlined"
      style={{
        borderColor: '#5790bd',
        paddingTop: '11px',
        color: '#ffffff',
        backgroundColor: '#5790bd',
        marginLeft: '12px',
      }}
      keyboardFocused={true}
      onClick={shareWithUsers}
      key="submit"
    >
      Submit
    </Button>,
  ]
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  }

  if (state?.configurations?.length <= 0) return <div>Loading...</div>

  return (
    <div>
      <GridList
        style={{
          padding: '2px',
          overflowY: 'auto',
          marginBottom: '128px',
        }}
        cols={state.gridCols}
        cellHeight="auto"
      >
        {generateCards(state.configurations, state.preferences)}
      </GridList>
      <div
        style={{
          right: 4,
          bottom: 4,
          position: 'fixed',
        }}
      >
        <form>
          <input
            accept=".json"
            name="file"
            id="raised-button-file"
            multiple
            type="file"
            style={{ display: 'none' }}
            onChange={handleChangeFile}
          />
          <label htmlFor="raised-button-file">
            <Button
              component="span"
              variant="fab"
              focusRipple
              style={{
                marginBottom: '8px',
              }}
            >
              <Tooltip title="Upload configuration file">
                <AttachFile />
              </Tooltip>
            </Button>
          </label>
        </form>
        <Button
          variant="fab"
          color="secondary"
          href={routes.createConfiguration}
          focusRipple
        >
          <Tooltip title="Add a configuration manually">
            <ContentAdd />
          </Tooltip>
        </Button>
      </div>
      <Dialog
        open={state.searchUsers}
        onClose={closeSearchUsers}
        fullScreen={true}
      >
        <DialogTitle
          id="alert-dialog-title"
          disableTypography={true}
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          <Typography
            variant="title"
            style={{
              color: '#ffffff',
            }}
          >
            Share your configuration
          </Typography>
        </DialogTitle>
        <DialogContent
          style={{
            padding: '24px',
            overflowY: 'visible',
          }}
        >
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: 'Shared with',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={state.friends}
            components={components}
            value={state.shared}
            onChange={handleChange('shared')}
            placeholder="Shared with"
            isMulti
          />
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
      <Snackbar
        open={state.snackTime}
        message="Your configuration has been updated."
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
      <Snackbar
        open={state.uploadSnack}
        message={user.message}
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
    </div>
  )
}

export default ConfigurationsList
