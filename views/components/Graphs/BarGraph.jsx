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
import { formatAsPercentage } from '../../fe-utils/formatAsPercentageUtil'

import { routes } from '../../routes/routes'

const TOTALS_STUDY = 'Totals'

const BarGraph = ({ graph }) => {
  const siteData = graph.dataBySite.sort((siteNameA, siteNameB) => {
    if (siteNameA.name === TOTALS_STUDY) {
      return -1
    }
    if (siteNameB.name === TOTALS_STUDY) {
      return 1
    }

    return siteNameA.name > siteNameB.name ? 1 : -1
  })

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
      <BarChart width={600} height={400} data={siteData}>
        <Legend
          verticalAlign="top"
          height={50}
          margin={{ top: 0, left: 0, right: 0, bottom: 20 }}
        />
        <XAxis dataKey="name" height={100}>
          <Label value="Study" />
        </XAxis>
        <YAxis width={80}>
          <Label value="Percent" angle={-90} />
        </YAxis>
        <Tooltip
          formatter={(value, name, props) => {
            const { payload } = props

            return `${payload.counts[name]} (${formatAsPercentage(value)})`
          }}
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
