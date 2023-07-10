import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import FileSaver from 'file-saver'

import Button from '@material-ui/core/Button'
import * as _ from 'lodash'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import DrawerComponent from '../components/Drawer'
import Drawer from '@material-ui/core/Drawer'

import SaveIcon from '@material-ui/icons/Save'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckIcon from '@material-ui/icons/Check'
import RefreshIcon from '@material-ui/icons/Refresh'
import Tooltip from '@material-ui/core/Tooltip'
import classNames from 'classnames'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Functions from '@material-ui/icons/Functions'

import SelectConfigurationForm from '../components/SelectConfigurationForm'

import getCounts from '../fe-utils/countUtil'
import { fetchSubjects, fetchConfigurations } from '../fe-utils/fetchUtil'
import { preparePreferences } from '../fe-utils/preferencesUtil'
import basePathConfig from '../../server/configs/basePathConfig'
import { apiRoutes } from '../routes/routes'
import Matrix from '../components/Matrix.d3'
import GraphPageTable from '../components/GraphPageTable'
import api from '../api'

const basePath = basePathConfig || ''
const cardSize = 20

const socketAddress = `https://${window.location.hostname}${basePath}/dashboard`
const socket = io(socketAddress, {
  requestTimeout: 1250,
  randomizationFactor: 0,
  reconnectionDelay: 0,
  autoConnect: false,
})

const GraphPage = () => {
  const { user, classes, theme } = useOutletContext()
  const el = React.useRef()
  const canvasRef = React.useRef()
  const graphRef = React.createRef()
  const { study, subject } = useParams()
  const [graphRendered, setGraphRendered] = React.useState(0)
  const [graph, setGraph] = React.useState({
    configurations: [],
    consentDate: '2022-03-05',
    matrixData: [],
  })
  const [graphDimensions, setGraphDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })
  const [socketData, setSocketData] = React.useState({
    socketIOSubjectRoom: `${basePath}/resync/${study}/${subject}`,
    socketIOUserRoom: user.uid,
    taskId: '',
  })
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [counts, setCounts] = React.useState({
    totalSubjects: 0,
    totalStudies: 0,
    totalDays: 0,
  })
  const [dayData, setDayData] = React.useState({
    startFromTheLastDay: false,
    startDay: 1,
    lastDay: null,
    maxDay: 1,
  })
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [openStat, setOpenStat] = React.useState(false)
  const [preferences, setPreferences] = React.useState(user.preferences)
  const [configurationsList, setConfigurationsList] = React.useState([])
  const downloadPng = () => {
    canvasRef.current.toBlob((blob) => {
      FileSaver.saveAs(blob, `${subject}.png`)
    })
  }
  const handleResize = () => {
    setGraphDimensions({
      height: window.innerHeight - 30,
      width: window.innerWidth,
    })
  }
  const resync = () => {
    window
      .fetch(socketData.socketIOSubjectRoom, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      })
      .then((response) => {
        if (response.status !== 201) {
          return
        }
        return response.json()
      })
      .then((response) => {
        setLoading(true)
        setSuccess(false)
        setSocketData({
          ...socketData,
          taskId: response.correlationId,
        })
      })
  }
  const closeStat = () => setOpenStat(false)
  const fetchGraph = () => api.dashboard.load(study, subject)
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
  const buttonClassname = classNames({
    [classes.buttonSuccess]: success,
  })
  const updateUserPreferences = async (configurationId) => {
    const { uid } = user
    const selectedUserPreference = preparePreferences(
      configurationId,
      preferences
    )

    return window
      .fetch(apiRoutes.preferences(uid), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          preferences: selectedUserPreference,
        }),
      })
      .then(() => fetchGraph())
      .then((graphData) => {
        setGraph(graphData.graph)
        setPreferences({ ...preferences, config: configurationId })
      })
  }
  const onMount = async () => {
    try {
      const [graphData, acl, configurations] = await Promise.all([
        fetchGraph(),
        fetchSubjects(),
        fetchConfigurations(user.uid),
      ])

      const maxObj = graphData.graph.matrixData.map((matrixData) =>
        _.maxBy(matrixData.data, ({ day }) => day)
      )

      setCounts(getCounts({ acl }))
      setConfigurationsList(configurations.data)
      setGraph(graphData.graph)
      setDayData({ ...dayData, maxDay: maxObj.day || 1 })
      renderMatrix()
      if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
          value: function (callback, type, quality) {
            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
              len = binStr.length,
              arr = new Uint8Array(len)

            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i)
            }
            callback(new Blob([arr], { type: type || 'image/png' }))
          },
        })
      }
      socket.open()
    } catch (e) {
      console.error(e.message)
    }
  }
  const renderMatrix = () => {
    if (el.current.firstChild) {
      el.current.removeChild(el.current.firstChild)
    }
    if (!graph.matrixData || Object.keys(graph.matrixData).length == 0) {
      return
    }
    const matrixProps = {
      id: 'matrix',
      type: 'matrix',
      width: graphDimensions.width,
      height: graphDimensions.height,
      data: graph.matrixData,
      cardSize,
      study,
      subject,
      consentDate: graph.consentDate,
      configuration: graph.configurations,
      startFromTheLastDay: dayData.startFromTheLastDay,
      startDay: dayData.startDay,
      lastDay: dayData.lastDay,
      maxDay: dayData.maxDay,
      user: user.uid,
    }

    graphRef.current = new Matrix(el.current, matrixProps)
    graphRef.current.create(graph.matrixData)
    setGraphRendered(graphRendered + 1)
  }

  React.useEffect(() => {
    onMount()

    return () => {
      socket.disconnect()
      socket.close()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  React.useEffect(() => {
    if (!el.current) {
      console.log('error')
      return
    }

    let updatedSvgElement = el.current.lastChild
    if (updatedSvgElement) {
      let svgString = new XMLSerializer().serializeToString(updatedSvgElement)
      let svgUrl =
        'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgString)

      const kanvas = canvasRef.current
      kanvas.width = updatedSvgElement.getBBox().width
      kanvas.height = updatedSvgElement.getBBox().height

      // png conversion
      let img = new Image()
      let ctx = kanvas.getContext('2d')

      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          kanvas.width,
          kanvas.height,
          0,
          0,
          kanvas.width,
          kanvas.height
        )
      }
      img.src = svgUrl
    }
  }, [graphRendered])

  React.useEffect(() => {
    renderMatrix()
  }, [graph.matrixData])

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar
          variant="dense"
          style={{
            paddingLeft: '16px',
          }}
        >
          <IconButton
            color="default"
            aria-label="Open drawer"
            onClick={handleDrawerToggle}
          >
            <img
              width="24px"
              height="24px"
              src={`${basePath}/img/favicon.png`}
            />
          </IconButton>
          <Typography
            variant="title"
            color="inherit"
            style={{
              color: 'default',
              fontSize: '18px',
              letterSpacing: '1.25px',
              flexGrow: 1,
            }}
          >
            {subject + ' - ' + study}
          </Typography>
          <div className={classes.configDropDownContainer}>
            <Typography className={classes.dropDownText}>
              Configuration
            </Typography>
            <SelectConfigurationForm
              configurations={configurationsList}
              onChange={updateUserPreferences}
              currentPreference={preferences}
              classes={classes}
            />
          </div>
          <IconButton
            color="default"
            aria-label="Open Stat"
            onClick={() => setOpenStat(true)}
          >
            <Functions />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <DrawerComponent
          classes={classes}
          totalStudies={counts.totalStudies}
          totalSubjects={counts.totalSubjects}
          totalDays={counts.totalDays}
          user={user}
        />
      </Drawer>
      <div
        className={classes.content}
        style={{
          padding: '12px',
          marginTop: '48px',
          overflowY: 'scroll',
        }}
      >
        <div className="Matrix">
          <div className="graph" ref={el} />
        </div>
        <div
          style={{
            right: 10,
            bottom: 10,
            position: 'fixed',
          }}
        >
          <Button
            variant="fab"
            onClick={downloadPng}
            id="downloadPng"
            focusRipple={true}
            style={{
              marginBottom: '6px',
            }}
          >
            <Tooltip title="Download as PNG">
              <SaveIcon />
            </Tooltip>
          </Button>
          <div>
            <Button
              variant="fab"
              color="secondary"
              className={buttonClassname}
              onClick={resync}
            >
              <Tooltip title="Resync with the File System">
                {success ? <CheckIcon /> : <RefreshIcon />}
              </Tooltip>
            </Button>
            {loading && (
              <CircularProgress size={68} className={classes.fabProgress} />
            )}
          </div>
        </div>
      </div>
      <Dialog modal={false} open={openStat} onClose={closeStat}>
        <DialogContent
          style={{
            padding: '0',
          }}
        >
          <GraphPageTable
            matrixData={graph.matrixData}
            maxDay={dayData.maxDay}
            theme={theme}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={closeStat}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default GraphPage
