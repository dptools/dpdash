import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Select from 'react-select'

import AttachFile from '@material-ui/icons/AttachFile'
import Button from '@material-ui/core/Button'
import CancelIcon from '@material-ui/icons/Cancel'
import Chip from '@material-ui/core/Chip'
import ContentAdd from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import GridList from '@material-ui/core/GridList'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { fetchUsernames } from '../../fe-utils/fetchUtil'
import { routes } from '../../routes/routes'
import api from '../../api'
import ConfigurationCard from '../ConfigurationCard'

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
const ConfigurationsList = ({ user, classes, theme, navigate }) => {
  const { uid } = user
  const userMessage = user.message
  const [configurations, setConfigurations] = useState([])
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
  })
  const [sharedWithState, setSharedWith] = useState({
    selectedConfig: {},
    configOwner: '',
    shared: [],
    searchUsers: false,
    friends: [],
  })
  const [grid, setGrid] = useState({
    gridCols: null,
    gridWidth: 350,
    cellWidth: null,
  })
  const [preferences, setPreferences] = useState({})
  const minimumInnerWidth = 768
  const gridColumnsDivisor = 350

  useEffect(() => {
    loadUserNames()
    handleResize()
    loadAllConfigurations(uid)
    fetchPreferences(uid)

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (userMessage?.length > 0) {
      setSnackBars((prevState) => {
        return {
          ...prevState,
          uploadSnack: true,
        }
      })
    }
  }, [userMessage])

  const loadUserNames = async () => {
    const usernames = await fetchUsernames()
    setSharedWith((prevstate) => {
      return {
        ...prevstate,
        friends: usernames.map((username) => ({
          value: username,
          label: username,
        })),
      }
    })
  }

  const handleResize = () => {
    if (window.innerWidth >= minimumInnerWidth) {
      const gridCols = Math.floor(window.innerWidth / gridColumnsDivisor)
      const cellWidth = window.innerWidth / gridCols
      setGrid((prevState) => {
        return {
          ...prevState,
          gridCols: gridCols,
          cellWidth,
        }
      })
    } else if (gridCols !== 1) {
      const cellWidth = window.innerWidth / 1

      setGrid((prevState) => {
        return {
          ...prevState,
          gridCols: 1,
          cellWidth,
        }
      })
    }
  }
  const fetchPreferences = async (userId) => {
    try {
      const user = await api.users.findOne(userId)
      setPreferences(user.preferences)
    } catch (error) {
      setSnackBar({ open: true, message: error.message })
    }
  }

  const loadAllConfigurations = async (userId) => {
    try {
      const configurations = await api.userConfigurations.all(userId)

      setConfigurations(configurations)
    } catch (error) {
      setSnackBar({ open: true, message: error.message })
    }
  }

  const handleCrumbs = () => setSnackBar({ open: false, message: '' })

  const openSearchUsers = (config) => {
    const { _id, readers, owner } = config
    setSharedWith((prevState) => {
      return {
        ...prevState,
        searchUsers: true,
        selectedConfig: {
          _id,
        },
        shared: readers.map((friend) => ({
          label: friend,
          value: friend,
        })),
        configOwner: owner,
      }
    })
  }
  const closeSearchUsers = () => {
    setSharedWith((prevState) => {
      return {
        ...prevState,
        searchUsers: false,
        selectedConfig: {
          _id: '',
        },
        shared: [],
        configOwner: '',
      }
    })
  }

  const shareWithUsers = async () => {
    try {
      const { _id } = sharedWithState.selectedConfig
      const configAttributes = {
        readers: sharedWithState.shared.map((sharedWith) => sharedWith.value),
      }

      await api.userConfigurations.update(uid, _id, configAttributes)

      loadAllConfigurations(uid)
      closeSearchUsers()
    } catch (error) {
      setSnackBar({ open: true, message: error.message })
    }
  }

  const handleChange = (name) => (value) => {
    const names = value.map((o) => o.value)

    if (names.indexOf(uid) === -1) throw new Error('Unable to delete owner.')

    setSharedWith((prevState) => {
      return { ...prevState, [name]: value }
    })
  }

  const handleChangeFile = async (e) => {
    try {
      e.preventDefault()
      const file = e.target.files ? e.target.files[0] : ''
      const json = await new Response(file).json()
      const userAttributes = {
        owner: uid,
        readers: [uid],
        ...json,
      }
      await api.userConfigurations.create(uid, userAttributes)

      loadAllConfigurations(uid)
    } catch (error) {
      setSnackBar({ open: true, message: error.message })
    }
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

  const copyConfiguration = async (configuration) => {
    try {
      const { _id, ...configAttributes } = configuration
      const newConfig = {
        ...configAttributes,
        owner: uid,
        readers: [uid],
        created: new Date().toUTCString(),
      }

      await api.userConfigurations.create(uid, newConfig)

      loadAllConfigurations(uid)
    } catch (error) {
      setSnackBar({ open: true, message: error.message })
    }
  }

  const removeConfiguration = async (configId) => {
    try {
      await api.userConfigurations.destroy(uid, configId)

      loadAllConfigurations(uid)

      if (preferences.config === configId) updateUserPreferences(configId)
    } catch (error) {
      setSnackBar(() => ({
        open: true,
        message: error.message,
      }))
    }
  }

  const updateConfiguration = async (configId, configAttributes) => {
    try {
      await api.userConfigurations.update(uid, configId, configAttributes)
      updateUserPreferences(configId)
      loadAllConfigurations(uid)
    } catch (error) {
      setSnackBar({ open: true, message: error.message })
    }
  }

  const updateUserPreferences = async (configId) => {
    try {
      const userAttributes = {
        preferences: {
          ...preferences,
          config: preferences.config === configId ? '' : configId,
        },
      }

      await api.users.update(uid, userAttributes)
      setPreferences(userAttributes.preferences)
    } catch (error) {
      setSnackBar({ open: true, message: error.message })
    }
  }

  const onRemoveOrUpdateConfig = (ownsConfig, configId) => {
    if (ownsConfig) {
      removeConfiguration(configId)
    } else {
      const configAttributes = {
        readers: readers.filter((reader) => reader !== uid),
      }
      updateConfiguration(configId, configAttributes)
    }
  }

  const onEditConfig = (configId) =>
    navigate(routes.editConfiguration(configId))

  const onViewConfig = (configId) =>
    navigate(routes.viewConfiguration(configId))

  return (
    <div>
      <GridList
        className={classes.gridList}
        cols={grid.gridCols}
        cellHeight="auto"
      >
        {configurations.map((config) => {
          return (
            <ConfigurationCard
              classes={classes}
              config={config}
              onEditConfig={onEditConfig}
              openSearch={openSearchUsers}
              onCopyConfig={copyConfiguration}
              onRemoveOrUpdateConfig={onRemoveOrUpdateConfig}
              onUpdatePreferences={updateUserPreferences}
              onViewConfig={onViewConfig}
              preferences={preferences}
              user={user}
              width={grid.cellWidth}
            />
          )
        })}
      </GridList>
      <div className={classes.uploadActions}>
        <form>
          <input
            accept=".json"
            name="file"
            id="raised-button-file"
            multiple
            type="file"
            className={classes.hiddenInput}
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
        open={sharedWithState.searchUsers}
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
          <Typography variant="title" className={classes.dialogText}>
            Share your configuration
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: 'Shared with',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={sharedWithState.friends}
            components={components}
            value={sharedWithState.shared}
            onChange={handleChange('shared')}
            placeholder="Shared with"
            isMulti
          />
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
      <Snackbar
        open={snackBar.open}
        message={snackBar.message}
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
    </div>
  )
}

export default ConfigurationsList
