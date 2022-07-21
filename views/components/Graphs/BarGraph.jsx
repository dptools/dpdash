import React from 'react'
import { 
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
  VictoryLabel,
} from 'victory';

import { graphStyles } from '../../styles/chart_styles';

const BarGraph = ({ graph }) => {
  return(
    <VictoryChart
      domainPadding={20}
      domain={{x: [0, 6]}}
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
      <VictoryAxis
        label='Site'
        style={graphStyles.xAxis}
      />
      <VictoryAxis
        label='Total(%)'
        dependentAxis
        style={graphStyles.yAxis}
      />
      <VictoryStack colorScale={graph.chartVariableColors}>
        {graph.data.map((data, idx) => (
          <VictoryBar 
            data={data} 
            x='siteName' 
            y='count' 
            key={idx}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
