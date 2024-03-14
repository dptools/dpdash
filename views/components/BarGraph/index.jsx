import React from 'react'
import { Link } from 'react-router-dom'
import { Paper } from '@mui/material'
import {
  BarChart,
  Bar,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import BarGraphTooltip from '../BarGraphTooltip'
import BarGraphXAxisLabel from '../BarGraphXAxisLabel'

import { sortDataBySite, sanitizeSiteData } from './helpers'

import { routes } from '../../routes/routes'
import { THEME, fontSize } from '../../../constants'

import './BarGraph.css'

const BarGraph = ({
  graph,
  tooltipPosition,
  handleTooltipPosition,
  displayLeft,
  setXAxisWidth,
  xAxisWidth,
  useSiteName,
}) => {
  const siteData = sortDataBySite(graph.dataBySite)
  const xAxisKey = useSiteName ? 'name' : 'siteCode'

  if (!siteData.length) {
    return (
      <>
        <p>This chart has no data to display.</p>
        <Link to={routes.editChart(graph.chart_id)}>Edit chart</Link>
      </>
    )
  }

  return (
    <Paper
      sx={{
        width: '100%',
      }}
    >
      <ResponsiveContainer
        width="100%"
        height={500}
        ref={(element) => {
          if (element) {
            const xAxis = element.querySelector('#chartWidth')

            if (xAxis) setXAxisWidth(Number(xAxis.attributes.width.value))
          }
        }}
      >
        <BarChart
          data={sanitizeSiteData(siteData)}
          barSize={50}
          margin={{ top: 50 }}
          onMouseMove={(data) => {
            if (data.isTooltipActive) {
              const xCoordinate = data.activeCoordinate.x

              handleTooltipPosition({ chartWidth: xAxisWidth, xCoordinate })
            }
          }}
          barCategoryGap={40}
        >
          <Legend
            margin={{ bottom: 10 }}
            verticalAlign="bottom"
            align="left"
            wrapperStyle={{
              paddingLeft: '80px',
              bottom: 50,
            }}
            iconType="rect"
          />

          <XAxis
            dataKey={xAxisKey}
            height={100}
            padding={{ left: 12.5, right: 12.5 }}
            id="chartWidth"
            interval={0}
            tick={useSiteName ? undefined : <BarGraphXAxisLabel />}
          />
          <YAxis width={80} domain={[0, 100]}>
            <Label value="Percent" angle={-90} />
          </YAxis>
          <Tooltip
            offset={0}
            position={tooltipPosition}
            content={
              <BarGraphTooltip
                studyTotals={graph.studyTotals}
                displayLeft={displayLeft}
                useSiteName={useSiteName}
              />
            }
          />
          <CartesianGrid stroke={THEME.palette.grey[100]} />
          {graph.labels.map((label) => {
            return (
              <Bar
                key={label.name}
                dataKey={`percentages[${label.name}]`}
                name={label.name}
                id={label.name}
                stackId="a"
                fill={label.color}
                barSize={90}
              >
                <LabelList
                  label={{ fontSize: fontSize[14] }}
                  valueAccessor={(entry) => {
                    const percent = entry.percentages[label.name]

                    if (percent && percent > 0) {
                      return `${percent.toFixed(0)}%`
                    }
                  }}
                  fill="white"
                />
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export default BarGraph
