import React from 'react'
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
  VictoryLabel,
  VictoryVoronoiContainer,
} from 'victory'

import { graphStyles } from '../../styles/chart_styles'
import { colors } from '../../../constants/styles'
import { TOTALS_STUDY } from '../../../constants'

const BarGraph = ({ graph }) => {
  return (
    <VictoryChart
      domainPadding={20}
      domain={{ x: [0, 6] }}
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum: { study, studyTarget, count, valueLabel } }) => {
            const showToolTip = study && count && study !== TOTALS_STUDY
            return valueLabel !== 'N/A' && showToolTip
              ? `Site:${study} \n Current: ${count} \n Target: ${studyTarget}`
              : null
          }}
        />
      }
    >
      <VictoryLegend
        orientation='horizontal'
        gutter={20}
        data={graph.legend}
        x={150}
        y={20}
        labelComponent={<VictoryLabel />}
      />
      <VictoryAxis label='Site' style={graphStyles.xAxis} />
      <VictoryAxis
        label='Total'
        dependentAxis
        style={graphStyles.yAxis}
        tickFormat={(yAxisValue) => `${yAxisValue}%`}
      />
      <VictoryStack>
        {Object.values(graph.data).map((data, idx) => (
          <VictoryBar
            data={data}
            x='study'
            y='percent'
            key={'bar' + idx}
            style={{
              data: {
                fill: ({ datum }) => datum.color,
              },
            }}
            labels={({ datum }) =>
              !!datum?.percent ? `${datum.percent.toFixed(0)}%` : null
            }
            labelComponent={
              <VictoryLabel
                dy={15}
                labelPlacement='perpendicular'
                style={{ fill: colors.anti_flash_white, fontSize: 8 }}
              />
            }
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
