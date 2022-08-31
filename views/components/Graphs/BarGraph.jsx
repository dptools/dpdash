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
  VictoryZoomContainer,
} from 'victory'

import { colors } from '../../../constants/styles'
import { graphStyles } from '../../styles/chart_styles'
import { toolTipPercent } from '../../fe-utils/tooltipUtil'

const NOT_AVAILABLE = 'N/A'
const TOTALS_STUDY = 'Totals'
const DEFAULT_ZOOM = 6


const BarGraph = ({ graph }) => {
  const siteDataPerChartValue = Object.values(graph.data)
  const numSitesPerValue = siteDataPerChartValue.map((value) => value.length)
  const numSites = Math.max(...numSitesPerValue)
  const initialZoom = Math.min(numSites, DEFAULT_ZOOM)

  return (
    <VictoryChart
      domainPadding={10}
      domain={{ x: [0, numSites], y: [0, 100] }}
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryZoomContainer
          allowZoom={false}
          allowPan={numSites > initialZoom}
          zoomDomain={{ x: [0, initialZoom + 0.5] }}
        />
      }
    >
      <VictoryLegend
        orientation="horizontal"
        gutter={20}
        data={graph.legend}
        x={150}
        y={20}
        labelComponent={<VictoryLabel />}
      />
      <VictoryAxis label="Site" style={graphStyles.xAxis} />
      <VictoryAxis
        label="Total"
        dependentAxis
        style={graphStyles.yAxis}
        tickFormat={(yAxisValue) => `${yAxisValue}%`}
      />
      <VictoryStack>
        {siteDataPerChartValue.map((data, idx) => (
          <VictoryBar
            data={data}
            x="study"
            y="percent"
            key={idx}
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
                labelPlacement="perpendicular"
                style={{ fill: colors.anti_flash_white, fontSize: 8 }}
              />
            }
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onMouseOver: () => {
                    return [
                      {
                        mutation: (props) => {
                          return {
                            style: {
                              ...props.style,
                              stroke: colors.black,
                              strokeWidth: 1,
                            },
                          }
                        },
                      },
                    ]
                  },
                  onMouseOut: () => {
                    return [
                      {
                        mutation: () => {
                          return null
                        },
                      },
                    ]
                  },
                },
              },
            ]}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
