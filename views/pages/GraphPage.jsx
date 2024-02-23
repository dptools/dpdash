import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import FileSaver from 'file-saver'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
} from '@mui/material'
import { Save, Functions } from '@mui/icons-material'

import PageHeader from '../components/PageHeader'
import SelectConfigurationForm from '../components/SelectConfigurationForm'
import Matrix from '../components/Matrix.d3'
import GraphPageTable from '../components/GraphPageTable'
import api from '../api'

const cardSize = 20

const GraphPage = () => {
  const { configurations, user, theme, setUser, setNotification } =
    useOutletContext()
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
        ...user,
        preferences: {
          ...user.preferences,
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
    const daysParticipated = graph.matrixData
      .flatMap(({ data }) => data)
      .map(({ day }) => day)
    const calculateMaxDay = Math.max(...daysParticipated)

    setDayData({ ...dayData, maxDay: calculateMaxDay || 1 })
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
      img.src = svgUrl

      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
    }
  }, [graphRendered])

  React.useEffect(() => {
    renderMatrix()
  }, [graph.matrixData])

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader title="Matrix" />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '15px',
          paddingBottom: '15px',
          maxWidth: '400px',
        }}
      >
        <SelectConfigurationForm
          configurations={configurations}
          onChange={updateUserPreferences}
          currentPreference={user.preferences}
        />
        <Button
          aria-label="Open Stat"
          onClick={() => setOpenStat(true)}
          endIcon={<Functions />}
        >
          View Table
        </Button>
      </Box>
      <div className="Matrix">
        <div className="graph" ref={el} />
      </div>
      <div>
        <Button
          variant="fab"
          onClick={downloadPng}
          id="downloadPng"
          focusRipple={true}
        >
          <Save />
        </Button>
      </div>
      <Dialog modal={false} open={openStat} onClose={closeStat}>
        <DialogContent>
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
    </Box>
  )
}

export default GraphPage
