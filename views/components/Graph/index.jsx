import React, { createRef, useRef } from 'react'
import FileSaver from 'file-saver'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
  Typography
} from '@mui/material'
import { Save, Functions } from '@mui/icons-material'

import Matrix from '../Matrix.d3'
import GraphPageTable from '../GraphPageTable'
import api from '../../api'
import { Link } from 'react-router-dom'
import { routes } from '../../routes/routes'
import { fontSize } from '../../../constants'

const cardSize = 20

export const Graph = ({ study, subject, user, theme, setNotification }) => {
  const canvasRef = useRef()
  const graphRef = createRef()
  const [openStat, setOpenStat] = React.useState(false)
  const [graph, setGraph] = React.useState({
    configurations: [],
    consentDate: '',
    matrixData: [],
  })
  const [dayData, setDayData] = React.useState({
    startFromTheLastDay: false,
    startDay: 1,
    lastDay: null,
    maxDay: 1,
  })

  const fetchGraph = async () => await api.dashboard.load(study, subject)
  const downloadPng = () =>
    canvasRef.current.toBlob((blob) => {
      FileSaver.saveAs(blob, `${subject}.png`)
    })

  const closeStat = () => setOpenStat(false)
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
      renderMatrix(graphData.graph)

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
  const renderMatrix = (graph) => {
    if (graphRef.current && graphRef.current.firstChild) {
      graphRef.current.removeChild(graphRef.current.firstChild)
    }
    if (!graph || !graph.matrixData || Object.keys(graph.matrixData).length == 0) {
      return
    }
    const matrixProps = {
      id: 'matrix',
      type: 'matrix',
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

    graphRef.current = new Matrix(graphRef.current, matrixProps)

    graphRef.current.create(graph.matrixData)
  }

  React.useEffect(() => {
    onMount()
  }, [user])

  React.useEffect(() => {
    if (!graphRef.current) {
      return
    }

    let updatedSvgElement = graphRef.current.lastChild
    if (updatedSvgElement) {
      let svgString = new XMLSerializer().serializeToString(updatedSvgElement)

      const kanvas = canvasRef.current
      kanvas.width = updatedSvgElement.getBBox().width
      kanvas.height = updatedSvgElement.getBBox().height

      let svgUrl =
        'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgString.replace('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">', `<svg xmlns="http://www.w3.org/2000/svg" width="${kanvas.width}" height="${kanvas.height}">`))

      // png conversion
      let img = new Image(kanvas.width, kanvas.height)
      let ctx = kanvas.getContext('2d')
      img.src = svgUrl

      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
    }
  }, [graphRef])

  React.useEffect(() => {
    renderMatrix(graph)
  }, [graph.matrixData])

  return (
    <Box>
      <Typography
        component={Link}
        to={routes.dashboard(study, subject)}
        sx={{ fontSize: fontSize[20], color: 'text.primary' }}
      >
        {subject}
      </Typography>
      <Button
        aria-label="Open Stat"
        onClick={() => setOpenStat(true)}
        endIcon={<Functions />}
      >
        View Table
    </Button>
      <div className="Matrix" style={{height: '65vh'}}>
        <div data-testid="graph" className="graph" ref={graphRef} style={{height:'65vh', overflow: 'scroll'}} />
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
      <canvas key={`${study}-${subject}`} ref={canvasRef} style={{display: 'none'}}/>
    </Box>
  )
}
