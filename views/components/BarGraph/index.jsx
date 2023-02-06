import React from 'react'
import {
  BarChart,
  Bar,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import BarGraphTooltip from '../BarGraphTooltip'

import { sortDataBySite, sanitizeSiteData } from './helpers'

import { routes } from '../../routes/routes'

const BarGraph = ({ graph, classes }) => {
  const siteData = sortDataBySite(graph.dataBySite)

  if (!siteData.length) {
    return (
      <>
        <p>This chart has no data to display.</p>
        <a href={routes.editChart(graph.chart_id)}>Edit chart</a>
      </>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart width={600} height={400} data={sanitizeSiteData(siteData)}>
        <Legend
          verticalAlign="top"
          height={50}
          margin={{ top: 0, left: 0, right: 0, bottom: 20 }}
        />
        <XAxis
          dataKey="name"
          height={100}
          angle={55}
          textAnchor="start"
          interval={0}
        />
        <YAxis width={80}>
          <Label value="Percent" angle={-90} />
        </YAxis>
        <Tooltip
          content={
            <BarGraphTooltip
              studyTotals={graph.studyTotals}
              classes={classes}
            />
          }
        />
        {graph.labels.map((label) => {
          return (
            <Bar
              key={label.name}
              dataKey={`percentages[${label.name}]`}
              name={label.name}
              id={label.name}
              stackId="a"
              maxBarSize={80}
              fill={label.color}
            >
              <LabelList
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
  )
}

export default BarGraph
