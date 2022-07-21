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
      />
      <VictoryAxis
        dependentAxis
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
