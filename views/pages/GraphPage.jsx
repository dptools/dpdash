import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import FileSaver from 'file-saver'

import Button from '@material-ui/core/Button'
import * as _ from 'lodash'

import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Save'
import Tooltip from '@material-ui/core/Tooltip'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Functions from '@material-ui/icons/Functions'

import SelectConfigurationForm from '../components/SelectConfigurationForm'
import Matrix from '../components/Matrix.d3'
import GraphPageTable from '../components/GraphPageTable'
import api from '../api'

const cardSize = 20

const GraphPage = () => {
  const {
    configurations,
    user,
    classes,
    theme,
    setOpenSidebar,
    setUser,
    setNotification,
  } = useOutletContext()
  const el = React.useRef()
  const canvasRef = React.useRef()
  const graphRef = React.createRef()
  const { study, subject } = useParams()
  const [graphRendered, setGraphRendered] = React.useState(0)
  const [graph, setGraph] = React.useState({
    configurations: [],
    consentDate: '',
    matrixData: [],
  })
  const [graphDimensions, setGraphDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })
  const [dayData, setDayData] = React.useState({
    startFromTheLastDay: false,
    startDay: 1,
    lastDay: null,
    maxDay: 1,
  })
  const [openStat, setOpenStat] = React.useState(false)
  const downloadPng = () =>
    canvasRef.current.toBlob((blob) => {
      FileSaver.saveAs(blob, `${subject}.png`)
    })

  const handleResize = () => {
    setGraphDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    })
  }
  const closeStat = () => setOpenStat(false)
  const fetchGraph = async () => await api.dashboard.load(study, subject)
  const updateUserPreferences = async (configurationId) => {
    try {
      const { uid } = user
      const userAttributes = {
        preferences: {
          config: configurationId,
        },
      }
      const updatedUser = await api.users.update(uid, userAttributes)
      const graphData = await fetchGraph()

      setUser(updatedUser)
      setGraph(graphData.graph)
      updateMaxDay(graphData.graph)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const updateMaxDay = (graph) => {
    const maxObj = _.maxBy(
      graph.matrixData.map((matrixData) =>
        _.maxBy(matrixData.data, ({ day }) => day)
      ),
      'day'
    )

    setDayData({ ...dayData, maxDay: maxObj.day || 1 })
  }
  const onMount = async () => {
    try {
      const graphData = await fetchGraph()

      setGraph(graphData.graph)
      updateMaxDay(graphData.graph)
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
    } catch (e) {
      setNotification({ open: true, message: e.message })
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
    setOpenSidebar(false)
    onMount()

    return () => {
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
    <>
      <div className={classes.graphToolbar}>
        <div className={classes.configDropDownContainer}>
          <SelectConfigurationForm
            configurations={configurations}
            onChange={updateUserPreferences}
            currentPreference={user.preferences}
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
      </div>
      <div className={classes.graph_content}>
        <div className="Matrix">
          <div className="graph" ref={el} />
        </div>
        <div className={classes.graphImageButton}>
          <Button
            variant="fab"
            onClick={downloadPng}
            id="downloadPng"
            focusRipple={true}
          >
            <Tooltip title="Download as PNG">
              <SaveIcon />
            </Tooltip>
          </Button>
        </div>
      </div>
      <Dialog modal={false} open={openStat} onClose={closeStat}>
        <DialogContent className={classes.graphTable}>
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
    </>
  )
}

export default GraphPage
