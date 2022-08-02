import React from 'react'
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
  VictoryLabel,
  VictoryTooltip,
} from 'victory'

import { graphStyles } from '../../styles/chart_styles'

const BarGraph = ({ graph }) => {
  return (
    <VictoryChart
      domainPadding={20}
      domain={{ x: [0, 6] }}
      theme={VictoryTheme.material}
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
      <VictoryAxis label='Total' dependentAxis style={graphStyles.yAxis} />
      <VictoryStack>
        {Object.values(graph.data).map((data, idx) => (
          <VictoryBar
            data={data}
            x='study'
            y='count'
            key={'bar' + idx}
            style={{
              data: {
                fill: ({ datum }) => datum.color,
              },
            }}
            labels={({ datum: { count, studyTarget, study } }) =>
              `Study: ${study} \n Current: ${count} \n Target: ${studyTarget}`
            }
            labelComponent={
              <VictoryTooltip
                constrainToVisibleArea
                style={{ fill: ({ datum }) => datum.color }}
              />
            }
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
