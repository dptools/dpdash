import React from 'react'
import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis, 
  VictoryTheme, 
  VictoryStack,
} from 'victory';


const BarGraph = ({ graph }) => {
  return(
    <VictoryChart
      domainPadding={20}
      domain={{x: [0, 6]}}
      theme={VictoryTheme.material}
    >
      <VictoryAxis
      />
      <VictoryAxis
        dependentAxis
      />
      <VictoryStack>
        {graph.data.map((data, idx) => (
          <VictoryBar 
            data={data} 
            x="siteName" 
            y="count" 
            key={idx}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
